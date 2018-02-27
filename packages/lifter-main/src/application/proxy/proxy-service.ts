import { OutgoingHttpHeaders } from "http";
import * as HttpMitmProxy from "http-mitm-proxy";
import * as URL from "url";
import { AutoResponderService } from "../../domains/proxy/auto-responder/auto-responder-service";
import { AutoResponderRepository } from "../../domains/proxy/auto-responder/lifecycle/auto-responder-repositoty";
import { ClientRequestEntity } from "../../domains/proxy/client-request/client-request-entity";
import { ClientRequestFactory } from "../../domains/proxy/client-request/lifecycle/client-request-factory";
import { ClientRequestRepository } from "../../domains/proxy/client-request/lifecycle/client-request-repository";
import { LocalFileResponderEntity } from "../../domains/proxy/local-file-responder/local-file-responder-entity";
import { PacFileService } from "../../domains/proxy/pac-file/pac-file-service";
import { RewriteRuleRepository } from "../../domains/proxy/rewrite-rule/lifecycle/rewrite-rule-repository";
import { NetworksetupProxyService } from "../../domains/settings/networksetup-proxy-service/networksetup-proxy-service";
import { BIND_HOST_NAME, LOCAL_PAC_FILE_URL, PROXY_PORT } from "../../settings";

export class ProxyService {
    private mitmProxy: HttpMitmProxy.IProxy = HttpMitmProxy();

    constructor(
        private sslCaDir: string,
        private pacFileService: PacFileService,
        private autoResponderService: AutoResponderService,
        private clientRequestRepository: ClientRequestRepository,
        private rewriteRuleRepository: RewriteRuleRepository,
        private clientRequestFactory: ClientRequestFactory,
        private networksetupProxyService: NetworksetupProxyService,
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
                this.onRequest(clientRequestEntity, blockCallback, passCallback);
            },
        );
    }

    private createServer(
        onRequestCallback: (
            href: URL.Url,
            blockCallback: (header: OutgoingHttpHeaders, body: Buffer | string) => void,
            passCallback: (error: Error | undefined) => void,
        ) => void,
    ) {
        this.mitmProxy.onError((context: HttpMitmProxy.IContext | null, err?: Error, errorKind?: string) => {
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

    private async onRequest(
        clientRequestEntity: ClientRequestEntity,
        blockCallback: (header: OutgoingHttpHeaders, body: Buffer | string) => void,
        passCallback: (error: Error | undefined) => void,
    ): Promise<void> {
        this.clientRequestRepository.store(clientRequestEntity);

        if (clientRequestEntity.href === LOCAL_PAC_FILE_URL) {
            return this.responsePacFile(blockCallback);
        }

        let localFileResponderEntity: LocalFileResponderEntity | null = await this.autoResponderService.find(
            clientRequestEntity,
        );

        if (!localFileResponderEntity) {
            return passCallback(undefined);
        }

        let body = await localFileResponderEntity.getBody();
        let rewriteRuleEntities = await this.rewriteRuleRepository.findMatchRules(clientRequestEntity);
        let header = rewriteRuleEntities.reduce((base, rewriteRuleEntity) => {
            return rewriteRuleEntity.applyHeader(base);
        }, localFileResponderEntity.getHeader());
        blockCallback(header, body);
    }

    private async responsePacFile(
        blockCallback: (header: OutgoingHttpHeaders, body: Buffer | string) => void,
    ): Promise<void> {
        let content = await this.pacFileService.getContent();
        blockCallback(
            {
                "content-length": content.length,
                "content-type": "application/x-ns-proxy-autoconfig",
            },
            content,
        );
    }
}
