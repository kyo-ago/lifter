import { OutgoingHttpHeaders } from "http";
import { ClientRequestEntity } from "../client-request/client-request-entity";
import { LocalFileResponseEntity } from "../local-file-response/local-file-response-entity";
import { RewriteRuleRepository } from "./lifecycle/rewrite-rule-repository";
import { RewriteRuleEntity } from "./rewrite-rule-entity";

export class RewriteRuleService {
    constructor(
        private rewriteRuleRepository: RewriteRuleRepository,
    ) {}

    async getHeader(
        localFileResponseEntity: LocalFileResponseEntity,
        clientRequestEntity: ClientRequestEntity,
    ): Promise<OutgoingHttpHeaders> {
        let rewriteRuleEntities = await this.find(clientRequestEntity);
        return rewriteRuleEntities.reduce((base, rewriteRuleEntity) => {
            return rewriteRuleEntity.applyHeader(base);
        }, localFileResponseEntity.getHeader());
    }

    private async find(clientRequestEntity: ClientRequestEntity): Promise<RewriteRuleEntity[]> {
        let entities = await this.rewriteRuleRepository.resolveAll();
        return entities.filter((rewriteRuleEntity: RewriteRuleEntity) => {
            rewriteRuleEntity.isMatchClientRequest(clientRequestEntity);
        });
    }
}
