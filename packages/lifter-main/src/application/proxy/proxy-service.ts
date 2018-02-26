import { OutgoingHttpHeaders } from "http";
import * as HttpMitmProxy from "http-mitm-proxy";
import * as URL from "url";
import { ClientRequestEntity } from "../../domains/proxy/client-request/client-request-entity";
import { ClientRequestFactory } from "../../domains/proxy/client-request/lifecycle/client-request-factory";
import { NetworksetupProxyService } from "../../domains/settings/networksetup-proxy-service/networksetup-proxy-service";
import { BIND_HOST_NAME, PROXY_PORT } from "../../settings";
import { ConnectionService } from "../connection/connection-service";

export class ProxyService {
    private mitmProxy: HttpMitmProxy.IProxy = HttpMitmProxy();

    constructor(
        private sslCaDir: string,
        private clientRequestFactory: ClientRequestFactory,
        private networksetupProxyService: NetworksetupProxyService,
        private connectionService: ConnectionService,
    ) {}

    async start(callback: (clientRequestEntity: ClientRequestEntity) => void) {
        await this.networksetupProxyService.startProxy();
        this.createServer(
            (
                url: URL,
                blockCallback: (header: OutgoingHttpHeaders, body: Buffer | string) => void,
                passCallback: (error: Error | undefined) => void,
            ) => {
                let clientRequestEntity = this.clientRequestFactory.create(url);
                callback(clientRequestEntity);
                this.connectionService.onRequest(clientRequestEntity, blockCallback, passCallback);
            },
        );
    }

    createServer(
        onRequestCallback: (
            href: URL.Url,
            blockCallback: (header: OutgoingHttpHeaders, body: Buffer | string) => void,
            passCallback: (error: Error | undefined) => void,
        ) => void,
    ) {
        this.mitmProxy.onError((context: HttpMitmProxy.IContext, err?: Error, errorKind?: string) => {
            // context may be null
            let url = context && context.clientToProxyRequest ? context.clientToProxyRequest.url : "";
            console.error(`${errorKind} on ${url}:${err}`);
        });

        this.mitmProxy.onRequest(async (ctx: HttpMitmProxy.IContext, callback: (error: Error | undefined) => void) => {
            let encrypted = (<any>ctx.clientToProxyRequest).client.encrypted;
            let host = ctx.clientToProxyRequest.headers.host;
            let path = ctx.clientToProxyRequest.url;
            let url = URL.parse(`http${encrypted ? `s` : ``}://${host}${path}`);

            onRequestCallback(
                url,
                (header: { [key: string]: string }, body: Buffer | string) => {
                    ctx.proxyToClientResponse.writeHead(200, header);
                    ctx.proxyToClientResponse.end(body);
                },
                callback,
            );
        });

        this.mitmProxy.listen({
            port: PROXY_PORT,
            host: BIND_HOST_NAME,
            silent: true,
            sslCaDir: this.sslCaDir,
        });
    }
}
