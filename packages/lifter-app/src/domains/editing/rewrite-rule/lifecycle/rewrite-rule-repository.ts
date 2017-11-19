import { OnMemoryRepository } from "typescript-dddbase";
import { ResolveAll } from "../../../libs/resolve-all";
import { ShareRewriteRuleIdentity } from "../../../share/share-rewrite-rule/share-rewrite-rule-identity";
import { RewriteRuleEntity } from "../rewrite-rule-entity";

export class RewriteRuleRepository extends OnMemoryRepository<ShareRewriteRuleIdentity, RewriteRuleEntity> {
    resolveSelectedRewriteRule(): RewriteRuleEntity {
        return Object.values(this.entities).find(entity => entity.selected);
    }

    resolveAll(): RewriteRuleEntity[] {
        return ResolveAll(this.entities);
    }
}
