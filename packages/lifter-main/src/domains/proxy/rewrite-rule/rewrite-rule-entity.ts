import { OutgoingHttpHeaders } from "http";
import { RewriteRuleEntityJSON } from "@kyo-ago/lifter-common";
import { BaseEntity } from "../../base/base-entity";
import { ClientRequestEntity } from "../client-request/client-request-entity";
import { RewriteRuleIdentity } from "./rewrite-rule-identity";
import { RewriteRuleAction, Types } from "./value-objects/rewrite-rule-action";
import { RewriteRuleHeader } from "./value-objects/rewrite-rule-header";
import { RewriteRuleUrlPattern } from "./value-objects/rewrite-rule-url-pattern";
import { RewriteRuleValue } from "./value-objects/rewrite-rule-value";

export class RewriteRuleEntity extends BaseEntity<RewriteRuleIdentity> {
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

    get action(): Types {
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

    isMatchClientRequest(clientRequestEntity: ClientRequestEntity): boolean {
        return this._url.isMatchUrl(clientRequestEntity.href);
    }

    applyHeader(header: OutgoingHttpHeaders): OutgoingHttpHeaders {
        if (this.action === "ADD") {
            header[this.header] = header[this.header] ? [].concat(header[this.header], this.value) : this.value;
        } else if (this.action === "MODIFY") {
            header[this.header] = this.value;
        } else if (this.action === "DELETE") {
            delete header[this.header];
        }
        return header;
    }
}
