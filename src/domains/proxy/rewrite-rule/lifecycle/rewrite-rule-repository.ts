import {OnMemoryRepository} from "typescript-dddbase";
import {ResolveAll} from "../../../libs/resolve-all";
import {ShareRewriteRuleIdentity} from '../../../share/share-rewrite-rule/share-rewrite-rule-identity';
import {ClientRequestEntity} from '../../client-request/client-request-entity';
import {RewriteRuleEntity} from '../rewrite-rule-entity';

type E = {
    [key: string]: RewriteRuleEntity;
};

export class RewriteRuleRepository extends OnMemoryRepository<ShareRewriteRuleIdentity, RewriteRuleEntity> {
    overwriteAll(rewriteRuleEntities: RewriteRuleEntity[]) {
        this.entities = rewriteRuleEntities.reduce((base: E, cur: RewriteRuleEntity) => {
            base[cur.id] = cur;
            return base;
        }, <E>{});
    }

    findMatchRules(clientRequestEntity: ClientRequestEntity): RewriteRuleEntity[] {
        return Object.values(this.entities).filter((rewriteRuleEntity: RewriteRuleEntity) => {
            rewriteRuleEntity.isMatchClientRequest(clientRequestEntity)
        });
    }

    resolveAll(): RewriteRuleEntity[] {
        return ResolveAll(this.entities);
    }
}
