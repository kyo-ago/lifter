import { RewriteRuleDeleteModifierEntityJSON } from "@lifter/lifter-common";
import { OutgoingHttpHeaders } from "http";
import { RewriteRuleModifierEntity } from "./rewrite-rule-modifier-entity";
import { RewriteRuleModifierIdentity } from "./rewrite-rule-modifier-identity";
import { RewriteRuleModifierAction } from "./value-objects/rewrite-rule-modifier-action";
import { RewriteRuleModifierHeader } from "./value-objects/rewrite-rule-modifier-header";

export class RewriteRuleDeleteModifierEntity extends RewriteRuleModifierEntity {
    private action = new RewriteRuleModifierAction("DELETE");

    constructor(identity: RewriteRuleModifierIdentity, private header: RewriteRuleModifierHeader) {
        super(identity);
    }

    get json(): RewriteRuleDeleteModifierEntityJSON {
        return {
            id: this.id,
            action: this.action.value,
            header: this.header.value,
        };
    }

    applyHeader(header: OutgoingHttpHeaders): OutgoingHttpHeaders {
        delete header[this.header.value];
        return header;
    }
}
