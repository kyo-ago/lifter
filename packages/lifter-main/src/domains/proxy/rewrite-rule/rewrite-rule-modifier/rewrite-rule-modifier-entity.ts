import { RewriteRuleModifierEntityJSON } from "@lifter/lifter-common";
import { OutgoingHttpHeaders } from "http";
import { BaseEntity } from "../../../base/base-entity";
import { RewriteRuleModifierIdentity } from "./rewrite-rule-modifier-identity";

export abstract class RewriteRuleModifierEntity extends BaseEntity<
    RewriteRuleModifierIdentity
> {
    abstract get json(): RewriteRuleModifierEntityJSON;
    abstract applyHeader(header: OutgoingHttpHeaders): OutgoingHttpHeaders;
}
