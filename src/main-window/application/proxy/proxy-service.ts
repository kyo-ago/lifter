import {ClientRequestUrl} from "../../domain/client-request/value-objects/client-request-url";
import {ClientRequestRepository} from "../../domain/client-request/lifecycle/client-request-repository";
import {PROXY_PORT} from "../../domain/settings";
import {AutoResponderEntryRepository} from "../../domain/auto-responder-entry/lifecycle/auto-responder-entry-repositoty";
import {ClientRequestFactory} from "../../domain/client-request/lifecycle/client-request-factory";
import {EventEmitter2} from "eventemitter2";
import {ClientRequestEntity} from "../../domain/client-request/client-request-entity";
const HttpMitmProxy = require('http-mitm-proxy');

export class ProxyService {
    private mitmProxy: HttpMitmProxy.IProxy;
    private eventEmitter = new EventEmitter2();

    constructor(
        private autoResponderRepository: AutoResponderEntryRepository,
        private clientRequestRepository: ClientRequestRepository,
        private clientRequestFactory: ClientRequestFactory,
        private appDataPath: string,
    ) {
        this.mitmProxy = HttpMitmProxy();
        this.eventEmitter = new EventEmitter2();
    }

    onRequest(callback: (clientRequestEntity: ClientRequestEntity) => void) {
        this.eventEmitter.addListener("onRequest", callback);
    }

    createServer() {
        this.mitmProxy.onError((context: HttpMitmProxy.IContext, err?: Error, errorKind?: string) => {
            // context may be null
            let url = (context && context.clientToProxyRequest) ? context.clientToProxyRequest.url : "";
            console.error(`${errorKind} on ${url}:${err}`);
        });

        this.mitmProxy.onRequest((ctx: HttpMitmProxy.IContext, callback: (error: Error | undefined) => void) => {
            let encrypted = (<any>ctx.clientToProxyRequest).client.encrypted;
            let host = ctx.clientToProxyRequest.headers.host;
            let url = ctx.clientToProxyRequest.url;
            let href = `http${encrypted ? `s` : ``}://${host}${url}`;

            let clientRequestUrl = new ClientRequestUrl(href);
            let clientRequestEntity = this.clientRequestFactory.create(clientRequestUrl);
            this.clientRequestRepository.store(clientRequestEntity);
            this.eventEmitter.emit("onRequest", clientRequestEntity);
            this.autoResponderRepository.findMatchEntry(clientRequestUrl).then((result) => {
                if (!result) {
                    return callback(undefined);
                }
                ctx.proxyToClientResponse.writeHead(200, result.getHeader());
                result.getBody().then((body) => {
                    ctx.proxyToClientResponse.end(body);
                });
            });
        });

        this.mitmProxy.listen({
            port: PROXY_PORT,
            silent: true,
            sslCaDir: this.appDataPath
        });
    }
}
