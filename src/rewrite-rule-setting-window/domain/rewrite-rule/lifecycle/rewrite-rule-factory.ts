import {ShareRewriteRuleFactory} from "../../../../share/domain/share-rewrite-rule/lifecycle/share-rewrite-rule-factory";
import {RewriteRuleEntity} from "../rewrite-rule-entity";
import {ShareRewriteRuleValue} from "../../../../share/domain/share-rewrite-rule/value-objects/share-rewrite-rule-value";
import {ShareRewriteRuleHeader} from "../../../../share/domain/share-rewrite-rule/value-objects/share-rewrite-rule-header";
import {ShareRewriteRuleAction} from "../../../../share/domain/share-rewrite-rule/value-objects/share-rewrite-rule-action";
import {ShareRewriteRuleIdentity} from "../../../../share/domain/share-rewrite-rule/share-rewrite-rule-identity";
import {ShareRewriteRuleEntityJSON} from "../../../../share/domain/share-rewrite-rule/share-rewrite-rule-entity";
import {ShareRewriteRuleUrlPattern} from "../../../../share/domain/share-rewrite-rule/value-objects/share-rewrite-rule-url-pattern";

export class RewriteRuleFactory extends ShareRewriteRuleFactory<RewriteRuleEntity> {
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
