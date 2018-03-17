import { RewriteRuleActionType, RewriteRuleEntityJSON, } from "@lifter/lifter-common";
import { OutgoingHttpHeaders } from "http";
import { BaseEntity } from "../../base/base-entity";
import { ClientRequestEntity } from "../client-request/client-request-entity";
import { RewriteRuleIdentity } from "./rewrite-rule-identity";
import { RewriteRuleModifierEntity } from "./rewrite-rule-modifier/rewrite-rule-modifier-entity";
import { RewriteRuleModifierIdentity } from "./rewrite-rule-modifier/rewrite-rule-modifier-identity";
import { RewriteRuleModifierMap } from "./value-objects/rewrite-rule-modifier-map";
import { RewriteRuleUrlPattern } from "./value-objects/rewrite-rule-url-pattern";

export class RewriteRuleEntity extends BaseEntity<RewriteRuleIdentity> {
    constructor(
        identity: RewriteRuleIdentity,
        private url: RewriteRuleUrlPattern,
        private modifier: RewriteRuleModifierMap,
    ) {
        super(identity);
    }

    get json(): RewriteRuleEntityJSON {
        return {
            id: this.id,
            url: this.url.value,
            modifier: this.modifier.json,
        };
    }

    addModifier(action: RewriteRuleActionType, modifier: RewriteRuleModifierEntity): void {
        return this.modifier.addModifier(action, modifier);
    }

    deleteModifier(action: RewriteRuleActionType, modifierId: RewriteRuleModifierIdentity): void {
        return this.modifier.deleteModifier(action, modifierId);
    }

    applyHeader(clientRequestEntity: ClientRequestEntity, header: OutgoingHttpHeaders): OutgoingHttpHeaders {
        if (!this.url.isMatchUrl(clientRequestEntity.pathSearch)) {
            return header;
        }
        return this.modifier.applyHeader(header);
    }
}
