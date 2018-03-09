import { RewriteRuleActionType } from "@lifter/lifter-common";
import { OutgoingHttpHeaders } from "http";
import { BaseEntity } from "../../../base/base-entity";
import { RewriteRuleModifierIdentity } from "./rewrite-rule-modifier-identity";
import { RewriteRuleModifierAction } from "./value-objects/rewrite-rule-modifier-action";
import { RewriteRuleModifierHeader } from "./value-objects/rewrite-rule-modifier-header";
import { RewriteRuleModifierValue } from "./value-objects/rewrite-rule-modifier-value";

export class RewriteRuleModifierEntity extends BaseEntity<RewriteRuleModifierIdentity> {
    constructor(
        identity: RewriteRuleModifierIdentity,
        private _action: RewriteRuleModifierAction,
        private _header: RewriteRuleModifierHeader,
        private _value: RewriteRuleModifierValue,
    ) {
        super(identity);
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

    get json() {
        return {
            id: this.id,
            action: this.action,
            header: this.header,
            value: this.value,
        };
    }

    applyHeader(header: OutgoingHttpHeaders): OutgoingHttpHeaders {
        if (this.action === "UPDATE") {
            header[this.header] = this.value;
        } else if (this.action === "DELETE") {
            delete header[this.header];
        }
        return header;
    }
}
