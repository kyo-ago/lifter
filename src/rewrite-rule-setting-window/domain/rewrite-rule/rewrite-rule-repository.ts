import {OnMemoryRepository} from "typescript-dddbase";
import {RewriteRuleEntity} from "./rewrite-rule-entity";
import {ShareRewriteRuleIdentity} from "../../../share/share-rewrite-rule/share-rewrite-rule-identity";

export class RewriteRuleRepository extends OnMemoryRepository<ShareRewriteRuleIdentity, RewriteRuleEntity> {
    resolveAll(): RewriteRuleEntity[] {
        return Object.keys(this.entities)
            .sort((a, b) => Number(b) - Number(a))
            .map((key) => this.entities[key])
        ;
    }

    resolveSelectedRewriteRule(): RewriteRuleEntity {
        return Object.values(this.entities).find((entity) => entity.selected);
    }
}
