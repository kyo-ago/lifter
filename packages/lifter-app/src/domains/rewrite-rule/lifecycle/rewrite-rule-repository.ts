import { OnMemoryRepository } from "typescript-dddbase";
import { ResolveAll } from "../../../libs/resolve-all";
import { RewriteRuleEntity } from "../rewrite-rule-entity";
import { RewriteRuleIdentity } from "../rewrite-rule-identity";

export class RewriteRuleRepository extends OnMemoryRepository<RewriteRuleIdentity, RewriteRuleEntity> {
    resolveSelectedRewriteRule(): RewriteRuleEntity | undefined {
        return Object.values(this.entities).find(entity => entity.selected);
    }

    resolveAll(): RewriteRuleEntity[] {
        return ResolveAll(this.entities);
    }
}
