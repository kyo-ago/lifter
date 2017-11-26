import { RewriteRuleEntity, RewriteRuleEntityJSON } from "../rewrite-rule-entity";
import { RewriteRuleIdentity } from "../rewrite-rule-identity";
import { RewriteRuleAction } from "../value-objects/rewrite-rule-action";
import { RewriteRuleHeader } from "../value-objects/rewrite-rule-header";
import { RewriteRuleUrlPattern } from "../value-objects/rewrite-rule-url-pattern";
import { RewriteRuleValue } from "../value-objects/rewrite-rule-value";

export class RewriteRuleFactory {
    private identity = 0;

    create(url: string, action: string, header: string, value: string): RewriteRuleEntity {
        return new RewriteRuleEntity(
            new RewriteRuleIdentity(this.identity++),
            new RewriteRuleUrlPattern(url),
            new RewriteRuleAction(action.toUpperCase()),
            new RewriteRuleHeader(header),
            new RewriteRuleValue(value)
        );
    }

    fromJSON(json: RewriteRuleEntityJSON): RewriteRuleEntity {
        this.identity = Math.max(json.id, this.identity);

        return new RewriteRuleEntity(
            new RewriteRuleIdentity(json.id),
            new RewriteRuleUrlPattern(json.url),
            new RewriteRuleAction(json.action),
            new RewriteRuleHeader(json.header),
            new RewriteRuleValue(json.value)
        );
    }
}
