import {ResolveAllOnMemoryRepository} from "../../../../share/domain/base/lifecycle/resolve-all-on-memory-repository";
import {ShareRewriteRuleIdentity} from "../../../../share/domain/share-rewrite-rule/share-rewrite-rule-identity";
import {ClientRequestEntity} from "../../client-request/client-request-entity";
import {RewriteRuleEntity} from "../rewrite-rule-entity";

export class RewriteRuleRepository extends ResolveAllOnMemoryRepository<ShareRewriteRuleIdentity, RewriteRuleEntity> {
    overwrite(rewriteRuleEntities: RewriteRuleEntity[]) {
        this.entities = rewriteRuleEntities.reduce((base, cur: RewriteRuleEntity) => {
            base[cur.id] = cur;
            return base;
        }, <{[key: string]: RewriteRuleEntity}>{});
    }

    findMatchRules(clientRequestEntity: ClientRequestEntity): RewriteRuleEntity[] {
        return Object.values(this.entities).filter((rewriteRuleEntity: RewriteRuleEntity) => {
            rewriteRuleEntity.isMatchClientRequest(clientRequestEntity)
        });
    }
}
