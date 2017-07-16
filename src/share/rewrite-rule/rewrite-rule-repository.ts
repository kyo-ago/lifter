import {OnMemoryRepository} from "typescript-dddbase";
import {RewriteRuleIdentity} from "./rewrite-rule-identity";
import {RewriteRuleEntity} from "./rewrite-rule-entity";

export class RewriteRuleRepository extends OnMemoryRepository<RewriteRuleIdentity, RewriteRuleEntity> {
}
