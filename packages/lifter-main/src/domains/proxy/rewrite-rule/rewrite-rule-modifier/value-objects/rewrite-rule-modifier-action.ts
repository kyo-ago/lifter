import { RewriteRuleActionType } from "@lifter/lifter-common";
import { BaseValueObject } from "../../../../base/value-objects/base-value-object";

const StringToType = (value: string): RewriteRuleActionType => {
    if (value === "UPDATE") {
        return value;
    } else if (value === "DELETE") {
        return value;
    }
    throw new Error("Invalid RewriteRuleActionType");
};

export class RewriteRuleModifierAction extends BaseValueObject<RewriteRuleActionType> {
    constructor(_value: string) {
        super(StringToType(_value));
    }
}
