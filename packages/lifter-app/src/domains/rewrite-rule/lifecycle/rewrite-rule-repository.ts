import { ResolveAll } from "@kyo-ago/lifter-common";
import { OnMemoryRepository } from "typescript-dddbase";
import { RewriteRuleEntity } from "../rewrite-rule-entity";
import { RewriteRuleIdentity } from "../rewrite-rule-identity";

export class RewriteRuleRepository extends OnMemoryRepository<RewriteRuleIdentity, RewriteRuleEntity> {
    resolveSelectedRewriteRule(): RewriteRuleEntity {
        return Object.values(this.entities).find(entity => entity.selected);
    }

    resolveAll(): RewriteRuleEntity[] {
        return ResolveAll(this.entities);
    }
}
