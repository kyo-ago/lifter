import { OnMemoryRepository } from "typescript-dddbase";
import { ResolveAll } from "../../libs/resolve-all";
import { RewriteRuleIdentity } from "../rewrite-rule-identity";
import { RewriteRuleEntity } from "../rewrite-rule-entity";

export class RewriteRuleRepository extends OnMemoryRepository<RewriteRuleIdentity, RewriteRuleEntity> {
    resolveSelectedRewriteRule(): RewriteRuleEntity {
        return Object.values(this.entities).find(entity => entity.selected);
    }

    resolveAll(): RewriteRuleEntity[] {
        return ResolveAll(this.entities);
    }
}
