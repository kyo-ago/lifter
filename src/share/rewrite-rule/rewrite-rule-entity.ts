import {BaseEntity} from "../domain/base/base-entity";
import {RewriteRuleIdentity} from "./rewrite-rule-identity";
import {RewriteRuleAction} from "./value-objects/rewrite-rule-action";
import {RewriteRuleHeader} from "./value-objects/rewrite-rule-header";
import {RewriteRuleValue} from "./value-objects/rewrite-rule-value";

export class RewriteRuleEntity extends BaseEntity<RewriteRuleIdentity> {
    constructor(
        identity: RewriteRuleIdentity,
        private _action: RewriteRuleAction,
        private _header: RewriteRuleHeader,
        private _value: RewriteRuleValue,
    ) {
        super(identity);
    }

    get action() {
        return this._action.value;
    }

    get header() {
        return this._header.value;
    }

    get value() {
        return this._value.value;
    }
}
