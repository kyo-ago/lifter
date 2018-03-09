import { OutgoingHttpHeaders } from "http";
import { ClientRequestEntity } from "../client-request/client-request-entity";
import { LocalFileResponseEntity } from "../local-file-response/local-file-response-entity";
import { RewriteRuleRepository } from "./lifecycle/rewrite-rule-repository";

export class RewriteRuleService {
    constructor(private rewriteRuleRepository: RewriteRuleRepository) {}

    async getHeader(
        localFileResponseEntity: LocalFileResponseEntity,
        clientRequestEntity: ClientRequestEntity,
    ): Promise<OutgoingHttpHeaders> {
        let rewriteRuleEntities = await this.rewriteRuleRepository.resolveAll();
        return rewriteRuleEntities.reduce((base, rewriteRuleEntity) => {
            return rewriteRuleEntity.applyHeader(clientRequestEntity, base);
        }, localFileResponseEntity.getHeader());
    }
}
