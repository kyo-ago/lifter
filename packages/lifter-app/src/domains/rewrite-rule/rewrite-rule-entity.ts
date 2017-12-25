import { BaseEntity, RewriteRuleActionType, RewriteRuleEntityJSON } from "@kyo-ago/lifter-common";
import { RewriteRuleIdentity } from "./rewrite-rule-identity";
import { RewriteRuleAction } from "./value-objects/rewrite-rule-action";
import { RewriteRuleHeader } from "./value-objects/rewrite-rule-header";
import { RewriteRuleUrlPattern } from "./value-objects/rewrite-rule-url-pattern";
import { RewriteRuleValue } from "./value-objects/rewrite-rule-value";

export class RewriteRuleEntity extends BaseEntity<RewriteRuleIdentity> {
    public selected: boolean = false;

    constructor(
        identity: RewriteRuleIdentity,
        private _url: RewriteRuleUrlPattern,
        private _action: RewriteRuleAction,
        private _header: RewriteRuleHeader,
        private _value: RewriteRuleValue
    ) {
        super(identity);
    }

    get url(): string {
        return this._url.value;
    }

    get action(): RewriteRuleActionType {
        return this._action.value;
    }

    get header(): string {
        return this._header.value;
    }

    get value(): string {
        return this._value.value;
    }

    get json(): RewriteRuleEntityJSON {
        return {
            id: this.id,
            url: this.url,
            action: this.action,
            header: this.header,
            value: this.value
        };
    }

    select() {
        this.selected = true;
    }

    deselect() {
        this.selected = false;
    }
}
