import {Entity} from "typescript-dddbase";
import {RewriteRuleResponseIdentity} from "./rewrite-rule-response-identity";

export class RewriteRuleResponseEntity extends Entity<RewriteRuleResponseIdentity> {
    constructor(
        identity: RewriteRuleResponseIdentity,
    ) {
        super(identity);
    }

    get id() {
        return this.getIdentity().getValue();
    }
}