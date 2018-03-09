import { RewriteRuleEntityJSON } from "@lifter/lifter-common";
import { OutgoingHttpHeaders } from "http";
import { BaseEntity } from "../../base/base-entity";
import { ClientRequestEntity } from "../client-request/client-request-entity";
import { RewriteRuleIdentity } from "./rewrite-rule-identity";
import { RewriteRuleModifierEntity } from "./rewrite-rule-modifier/rewrite-rule-modifier-entity";
import { RewriteRuleUrlPattern } from "./value-objects/rewrite-rule-url-pattern";

export class RewriteRuleEntity extends BaseEntity<RewriteRuleIdentity> {
    constructor(
        identity: RewriteRuleIdentity,
        private _url: RewriteRuleUrlPattern,
        private _modifiers: RewriteRuleModifierEntity[],
    ) {
        super(identity);
    }

    get json(): RewriteRuleEntityJSON {
        return {
            id: this.id,
            url: this._url.value,
            modifiers: this._modifiers.map(modifier => modifier.json),
        };
    }

    isMatchClientRequest(clientRequestEntity: ClientRequestEntity): boolean {
        return this._url.isMatchUrl(clientRequestEntity.href);
    }

    applyHeader(header: OutgoingHttpHeaders): OutgoingHttpHeaders {
        return this._modifiers.reduce((header, modifier) => {
            return modifier.applyHeader(header);
        }, header);
    }
}
