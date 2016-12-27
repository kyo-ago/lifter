import {RewriteRuleResponseIdentity} from "./rewrite-rule-response-identity";
import {RewriteRuleResponseEntity} from "./rewrite-rule-response-entity";
export class RewriteRuleResponseFactory {
    private static identity = 0;

    static create(): RewriteRuleResponseEntity {
        return new RewriteRuleResponseEntity(
            new RewriteRuleResponseIdentity(this.identity++),
        );
    }
}