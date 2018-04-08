import { RewriteRuleUpdateModifierEntityJSON } from "@lifter/lifter-common";
import { OutgoingHttpHeaders } from "http";
import { RewriteRuleModifierEntity } from "./rewrite-rule-modifier-entity";
import { RewriteRuleModifierIdentity } from "./rewrite-rule-modifier-identity";
import { RewriteRuleModifierHeader } from "./value-objects/rewrite-rule-modifier-header";
import { RewriteRuleModifierValue } from "./value-objects/rewrite-rule-modifier-value";

export class RewriteRuleUpdateModifierEntity extends RewriteRuleModifierEntity {
    constructor(
        identity: RewriteRuleModifierIdentity,
        private header: RewriteRuleModifierHeader,
        private value: RewriteRuleModifierValue,
    ) {
        super(identity);
    }

    get json(): RewriteRuleUpdateModifierEntityJSON {
        return {
            id: this.id,
            header: this.header.value,
            value: this.value.value,
        };
    }

    applyHeader(header: OutgoingHttpHeaders): OutgoingHttpHeaders {
        header[this.header.value] = this.value.value;
        return header;
    }
}
