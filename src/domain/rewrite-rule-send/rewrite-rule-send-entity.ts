import {Entity} from "typescript-dddbase";
import {RewriteRuleSendIdentity} from "./rewrite-rule-send-identity";

export class RewriteRuleSendEntity extends Entity<RewriteRuleSendIdentity> {
    constructor(
        identity: RewriteRuleSendIdentity,
    ) {
        super(identity);
    }

    get id() {
        return this.getIdentity().getValue();
    }
}