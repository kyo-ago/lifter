import { OutgoingHttpHeaders } from "http";
import * as HttpMitmProxy from "http-mitm-proxy";
import * as URL from "url";

export class ClientResponderContext {
    constructor(
        private ctx: HttpMitmProxy.IContext,
    ) {}

    getUrl(): URL.Url {
        let encrypted = (<any>this.ctx.clientToProxyRequest).client.encrypted;
        let host = this.ctx.clientToProxyRequest.headers.host;
        let path = this.ctx.clientToProxyRequest.url;
        return URL.parse(`http${encrypted ? `s` : ``}://${host}${path}`);
    }

    response(header: OutgoingHttpHeaders, body: Buffer | string): void {
        this.ctx.proxyToClientResponse.writeHead(200, header);
        this.ctx.proxyToClientResponse.end(body);
    }
}
