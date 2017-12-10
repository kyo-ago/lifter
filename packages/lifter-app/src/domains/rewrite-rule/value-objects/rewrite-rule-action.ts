import { BaseValueObject, RewriteRuleActionType } from "@kyo-ago/lifter-common";

const StringToType = (value: string): RewriteRuleActionType => {
    if (value === "ADD") {
        return "ADD";
    } else if (value === "MODIFY") {
        return "MODIFY";
    } else if (value === "DELETE") {
        return "DELETE";
    }
    throw new Error("Invalid ShareRewriteRuleAction");
};

export class RewriteRuleAction extends BaseValueObject<RewriteRuleActionType> {
    constructor(_value: string) {
        super(StringToType(_value));
    }
}
