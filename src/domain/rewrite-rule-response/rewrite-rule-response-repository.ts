import {OnMemoryRepository} from "typescript-dddbase";
import {RewriteRuleResponseIdentity} from "./rewrite-rule-response-identity";
import {RewriteRuleResponseEntity} from "./rewrite-rule-response-entity";

export class RewriteRuleResponseRepository extends OnMemoryRepository<RewriteRuleResponseIdentity, RewriteRuleResponseEntity> {
}
