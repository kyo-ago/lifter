import {OutgoingHttpHeaders} from "http";
import {PROXY_PORT} from "../../../../settings";
import * as HttpMitmProxy from "http-mitm-proxy";

export class ProxyService {
    private mitmProxy: HttpMitmProxy.IProxy = HttpMitmProxy();

    constructor(
        private appDataPath: string,
    ) {
    }

    createServer(
        onRequestCallback: (
            href: string,
            successCallback: (header: OutgoingHttpHeaders, body: Buffer | string) => void,
            errorCallback: (error: Error | undefined) => void,
        ) => void,
    ) {
        this.mitmProxy.onError((context: HttpMitmProxy.IContext, err?: Error, errorKind?: string) => {
            // context may be null
            let url = (context && context.clientToProxyRequest) ? context.clientToProxyRequest.url : "";
            console.error(`${errorKind} on ${url}:${err}`);
        });

        this.mitmProxy.onRequest(async (ctx: HttpMitmProxy.IContext, callback: (error: Error | undefined) => void) => {
            let encrypted = (<any>ctx.clientToProxyRequest).client.encrypted;
            let host = ctx.clientToProxyRequest.headers.host;
            let url = ctx.clientToProxyRequest.url;
            let href = `http${encrypted ? `s` : ``}://${host}${url}`;

            onRequestCallback(href, (header: {[key: string]: string}, body: Buffer | string) => {
                ctx.proxyToClientResponse.writeHead(200, header);
                ctx.proxyToClientResponse.end(body);
            }, callback);
        });

        this.mitmProxy.listen({
            port: PROXY_PORT,
            silent: true,
            sslCaDir: this.appDataPath
        });
    }
}
