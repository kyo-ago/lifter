import {RewriteRuleIdentity} from "./rewrite-rule-identity";
import {RewriteRuleEntity} from "./rewrite-rule-entity";
import {RewriteRuleAction} from "./value-objects/rewrite-rule-action";
import {RewriteRuleHeader} from "./value-objects/rewrite-rule-header";
import {RewriteRuleValue} from "./value-objects/rewrite-rule-value";

export class RewriteRuleFactory {
    private static identity = 0;

    static create(
        action: string,
        header: string,
        value: string,
    ): RewriteRuleEntity {
        return new RewriteRuleEntity(
            new RewriteRuleIdentity(this.identity++),
            new RewriteRuleAction(action),
            new RewriteRuleHeader(header),
            new RewriteRuleValue(value),
        );
    }
}