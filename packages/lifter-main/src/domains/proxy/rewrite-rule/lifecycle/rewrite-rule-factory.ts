import { RewriteRuleEntityJSON } from "@lifter/lifter-common";
import { RewriteRuleEntity } from "../rewrite-rule-entity";
import { RewriteRuleIdentity } from "../rewrite-rule-identity";
import { RewriteRuleAction } from "../value-objects/rewrite-rule-action";
import { RewriteRuleHeader } from "../value-objects/rewrite-rule-header";
import { RewriteRuleUrlPattern } from "../value-objects/rewrite-rule-url-pattern";
import { RewriteRuleValue } from "../value-objects/rewrite-rule-value";

export class RewriteRuleFactory {
    static fromJSON(json: RewriteRuleEntityJSON): RewriteRuleEntity {
        return new RewriteRuleEntity(
            new RewriteRuleIdentity(json.id),
            new RewriteRuleUrlPattern(json.url),
            new RewriteRuleAction(json.action),
            new RewriteRuleHeader(json.header),
            new RewriteRuleValue(json.value)
        );
    }
}
