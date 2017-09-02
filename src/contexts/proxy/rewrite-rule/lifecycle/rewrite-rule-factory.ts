import {ShareRewriteRuleEntityJSON} from "../../../share/domain/share-rewrite-rule/share-rewrite-rule-entity";
import {ShareRewriteRuleIdentity} from "../../../share/domain/share-rewrite-rule/share-rewrite-rule-identity";
import {ShareRewriteRuleAction} from "../../../share/domain/share-rewrite-rule/value-objects/share-rewrite-rule-action";
import {ShareRewriteRuleHeader} from "../../../share/domain/share-rewrite-rule/value-objects/share-rewrite-rule-header";
import {ShareRewriteRuleUrlPattern} from "../../../share/domain/share-rewrite-rule/value-objects/share-rewrite-rule-url-pattern";
import {ShareRewriteRuleValue} from "../../../share/domain/share-rewrite-rule/value-objects/share-rewrite-rule-value";
import {RewriteRuleEntity} from "../rewrite-rule-entity";

export class RewriteRuleFactory {
    private identity = 0;

    create(
        url: string,
        action: string,
        header: string,
        value: string,
    ): RewriteRuleEntity {
        return new RewriteRuleEntity(
            new ShareRewriteRuleIdentity(this.identity++),
            new ShareRewriteRuleUrlPattern(url),
            new ShareRewriteRuleAction(action),
            new ShareRewriteRuleHeader(header),
            new ShareRewriteRuleValue(value),
        );
    }

    fromJSON(json: ShareRewriteRuleEntityJSON): RewriteRuleEntity {
        return new RewriteRuleEntity(
            new ShareRewriteRuleIdentity(json.id),
            new ShareRewriteRuleUrlPattern(json.url),
            new ShareRewriteRuleAction(json.action),
            new ShareRewriteRuleHeader(json.header),
            new ShareRewriteRuleValue(json.value),
        );
    }
}
