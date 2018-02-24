import { OutgoingHttpHeaders } from "http";
import { AutoResponderRepository } from "../../domains/proxy/auto-responder/lifecycle/auto-responder-repositoty";
import { ClientRequestEntity } from "../../domains/proxy/client-request/client-request-entity";
import { ClientRequestRepository } from "../../domains/proxy/client-request/lifecycle/client-request-repository";
import { LocalFileResponderEntity } from "../../domains/proxy/local-file-responder/local-file-responder-entity";
import { PacFileService } from "../../domains/proxy/pac-file/pac-file-service";
import { RewriteRuleRepository } from "../../domains/proxy/rewrite-rule/lifecycle/rewrite-rule-repository";
import { LOCAL_PAC_FILE_URL } from "../../settings";

export class ConnectionService {
    constructor(
        private pacFileService: PacFileService,
        private autoResponderRepository: AutoResponderRepository,
        private clientRequestRepository: ClientRequestRepository,
        private rewriteRuleRepository: RewriteRuleRepository,
    ) {}

    async onRequest(
        clientRequestEntity: ClientRequestEntity,
        blockCallback: (header: OutgoingHttpHeaders, body: Buffer | string) => void,
        passCallback: (error: Error | undefined) => void,
    ): Promise<void> {
        this.clientRequestRepository.store(clientRequestEntity);

        if (clientRequestEntity.href === LOCAL_PAC_FILE_URL) {
            return this.responsePacFile(blockCallback);
        }

        let localFileResponderEntity: LocalFileResponderEntity | null = await this.autoResponderRepository.findMatchEntry(
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
