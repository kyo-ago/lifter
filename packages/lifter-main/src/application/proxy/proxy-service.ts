import * as HttpMitmProxy from "http-mitm-proxy";
import { ClientResponder } from "../../domains/proxy/client-responder/client-responder";
import { ClientResponderContext } from "../../domains/proxy/client-responder/lib/client-responder-context";
import { NetworksetupProxyService } from "../../domains/settings/networksetup-proxy-service/networksetup-proxy-service";
import { BIND_HOST_NAME, PROXY_PORT } from "../../settings";

export class ProxyService {
    private mitmProxy: HttpMitmProxy.IProxy = HttpMitmProxy();

    constructor(
        private sslCaDir: string,
        private networksetupProxyService: NetworksetupProxyService,
        private clientResponder: ClientResponder,
    ) {}

    async start() {
        await this.networksetupProxyService.startProxy();

        this.mitmProxy.onError((context: HttpMitmProxy.IContext | null, err?: Error, errorKind?: string) => {
            // context may be null
            let url = context && context.clientToProxyRequest ? context.clientToProxyRequest.url : "";
            console.error(`${errorKind} on ${url}:${err}`);
        });

        this.mitmProxy.onRequest(async (ctx: HttpMitmProxy.IContext, passCallback: (error: Error | undefined) => void) => {
            let clientResponderContext = new ClientResponderContext(ctx, passCallback);
            this.clientResponder.onRequest(clientResponderContext);
        });

        this.mitmProxy.listen({
            port: PROXY_PORT,
            host: BIND_HOST_NAME,
            silent: true,
            sslCaDir: this.sslCaDir,
        });
    }
}
