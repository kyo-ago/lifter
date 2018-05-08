import { RewriteRuleDeleteModifierEntityJSON } from "@lifter/lifter-common";
import { OutgoingHttpHeaders } from "http";
import { RewriteRuleModifierEntity } from "./rewrite-rule-modifier-entity";
import { RewriteRuleModifierIdentity } from "./rewrite-rule-modifier-identity";
import { RewriteRuleModifierHeader } from "./value-objects/rewrite-rule-modifier-header";

export class RewriteRuleDeleteModifierEntity extends RewriteRuleModifierEntity {
    constructor(
        identity: RewriteRuleModifierIdentity,
        private header: RewriteRuleModifierHeader,
    ) {
        super(identity);
    }

    get json(): RewriteRuleDeleteModifierEntityJSON {
        return {
            id: this.id,
            header: this.header.value,
        };
    }

    applyHeader(header: OutgoingHttpHeaders): OutgoingHttpHeaders {
        delete header[this.header.value];
        return header;
    }
}
