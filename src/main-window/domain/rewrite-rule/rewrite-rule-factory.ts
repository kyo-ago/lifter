import {RewriteRuleIdentity} from "./rewrite-rule-identity";
import {RewriteRuleEntity} from "./rewrite-rule-entity";

export class RewriteRuleFactory {
    private static identity = 0;

    static create(): RewriteRuleEntity {
        return new RewriteRuleEntity(
            new RewriteRuleIdentity(this.identity++),
        );
    }
}