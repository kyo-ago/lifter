import {ClientRequestUrl} from "../../domain/client-request/value-objects/client-request-url";
import {ClientRequestRepository} from "../../domain/client-request/client-request-repository";
import {PROXY_PORT} from "../../domain/settings";
import {AutoResponderRepository} from "../../domain/auto-responder-entry/auto-responder-repositoty";

const Proxy = require('http-mitm-proxy');
const proxy = Proxy();

export class ProxyService {
    constructor(
        private autoResponderRepository: AutoResponderRepository,
        private clientRequestRepository: ClientRequestRepository,
        private appDataPath: string,
    ) {
    }

    createServer() {
        proxy.onError((ctx: any, err: any) => {
            console.error('proxy error:', err);
        });

        proxy.onRequest((ctx: any, callback: any) => {
            let encrypted = ctx.clientToProxyRequest.client.encrypted;
            let host = ctx.clientToProxyRequest.headers.host;
            let url = ctx.clientToProxyRequest.url;
            let href = `http${encrypted ? `s` : ``}://${host}${url}`;

            let clientRequestUrl = new ClientRequestUrl(href);
            this.clientRequestRepository.storeRequest(clientRequestUrl);
            this.autoResponderRepository.findMatchEntry(clientRequestUrl).then((result) => {
                if (!result) {
                    return callback();
                }
                ctx.proxyToClientResponse.writeHead(200, result.getHeader());
                result.getBody().then((body) => {
                    ctx.proxyToClientResponse.end(body);
                });
            });
        });

        proxy.listen({
            port: PROXY_PORT,
            silent: true,
            sslCaDir: this.appDataPath
        }, (err: any) => {
            if (err) {
                console.error(err);
            }
        });
    }
}
