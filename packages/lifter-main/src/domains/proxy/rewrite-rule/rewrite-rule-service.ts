import { CreateRewriteRuleModifierEntityJSON, } from "@lifter/lifter-common";
import { OutgoingHttpHeaders } from "http";
import { ClientRequestEntity } from "../client-request/client-request-entity";
import { LocalFileResponseEntity } from "../local-file-response/local-file-response-entity";
import { RewriteRuleFactory, stringToRewriteRuleActionType } from "./lifecycle/rewrite-rule-factory";
import { RewriteRuleRepository } from "./lifecycle/rewrite-rule-repository";
import { RewriteRuleIdentity } from "./rewrite-rule-identity";

export class RewriteRuleService {
    constructor(
        private rewriteRuleFactory: RewriteRuleFactory,
        private rewriteRuleRepository: RewriteRuleRepository,
    ) {}

    async getHeader(
        localFileResponseEntity: LocalFileResponseEntity,
        clientRequestEntity: ClientRequestEntity,
    ): Promise<OutgoingHttpHeaders> {
        let rewriteRuleEntities = await this.rewriteRuleRepository.resolveAll();
        return rewriteRuleEntities.reduce((base, rewriteRuleEntity) => {
            return rewriteRuleEntity.applyHeader(clientRequestEntity, base);
        }, localFileResponseEntity.getHeader());
    }

    async addModifier(id: number, text: string, param: CreateRewriteRuleModifierEntityJSON) {
        let action = stringToRewriteRuleActionType(text);
        let modifier = this.rewriteRuleFactory.createModifier(action, param);
        let entity = await this.rewriteRuleRepository.resolve(new RewriteRuleIdentity(id));
        entity.addModifier(action, modifier);
    }
}
