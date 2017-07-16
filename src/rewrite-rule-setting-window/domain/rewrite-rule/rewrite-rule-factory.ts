import {RewriteRuleEntity} from "./rewrite-rule-entity";
import {ShareRewriteRuleValue} from "../../../share/share-rewrite-rule/value-objects/share-rewrite-rule-value";
import {ShareRewriteRuleHeader} from "../../../share/share-rewrite-rule/value-objects/share-rewrite-rule-header";
import {ShareRewriteRuleAction} from "../../../share/share-rewrite-rule/value-objects/share-rewrite-rule-action";
import {ShareRewriteRuleIdentity} from "../../../share/share-rewrite-rule/share-rewrite-rule-identity";

export class RewriteRuleFactory {
    private static identity = 0;

    static create(
        action: string,
        header: string,
        value: string,
    ): RewriteRuleEntity {
        return new RewriteRuleEntity(
            new ShareRewriteRuleIdentity(this.identity++),
            new ShareRewriteRuleAction(action),
            new ShareRewriteRuleHeader(header),
            new ShareRewriteRuleValue(value),
        );
    }
}
