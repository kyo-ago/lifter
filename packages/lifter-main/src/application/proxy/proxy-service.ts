import * as HttpMitmProxy from "http-mitm-proxy";
import { ClientRequestService } from "../../domains/proxy/client-request/client-request-service";
import { ClientResponderContext } from "../../domains/proxy/client-request/lib/client-responder-context";
import { SslCertificatePath } from "../../libs/ssl-certificate-path";
import { BIND_HOST_NAME, PROXY_PORT } from "../../settings";

export class ProxyService {
    private mitmProxy: HttpMitmProxy.IProxy = HttpMitmProxy();

    constructor(private sslCertificatePath: SslCertificatePath, private clientRequestService: ClientRequestService) {}

    async listen() {
        this.mitmProxy.onError((context: HttpMitmProxy.IContext | null, err?: Error, errorKind?: string) => {
            // context may be null
            let url = context && context.clientToProxyRequest ? context.clientToProxyRequest.url : "";
            console.error(`${errorKind} on ${url}:${err}`);
        });

        this.mitmProxy.onRequest(
            async (ctx: HttpMitmProxy.IContext, passCallback: (error: Error | undefined) => void) => {
                let clientResponderContext = new ClientResponderContext(ctx, passCallback);
                this.clientRequestService.onRequest(clientResponderContext);
            },
        );

        this.mitmProxy.listen({
            port: PROXY_PORT,
            host: BIND_HOST_NAME,
            silent: true,
            sslCaDir: this.sslCertificatePath.getCaDir(),
        });
    }

    shutdown() {
        this.mitmProxy.close();
    }
}
