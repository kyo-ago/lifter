import { ShareRewriteRuleEntityJSON } from "../../../share/share-rewrite-rule/share-rewrite-rule-entity";
import { ShareRewriteRuleIdentity } from "../../../share/share-rewrite-rule/share-rewrite-rule-identity";
import { ShareRewriteRuleAction } from "../../../share/share-rewrite-rule/value-objects/share-rewrite-rule-action";
import { ShareRewriteRuleHeader } from "../../../share/share-rewrite-rule/value-objects/share-rewrite-rule-header";
import { ShareRewriteRuleUrlPattern } from "../../../share/share-rewrite-rule/value-objects/share-rewrite-rule-url-pattern";
import { ShareRewriteRuleValue } from "../../../share/share-rewrite-rule/value-objects/share-rewrite-rule-value";
import { RewriteRuleEntity } from "../rewrite-rule-entity";

export class RewriteRuleFactory {
    static fromJSON(json: ShareRewriteRuleEntityJSON): RewriteRuleEntity {
        return new RewriteRuleEntity(
            new ShareRewriteRuleIdentity(json.id),
            new ShareRewriteRuleUrlPattern(json.url),
            new ShareRewriteRuleAction(json.action),
            new ShareRewriteRuleHeader(json.header),
            new ShareRewriteRuleValue(json.value)
        );
    }
}
