import { BaseValueObject } from "../../../base/value-objects/base-value-object";

export type Types = "ADD" | "MODIFY" | "DELETE";

const StringToType = (value: string): Types => {
    if (value === "ADD") {
        return "ADD";
    } else if (value === "MODIFY") {
        return "MODIFY";
    } else if (value === "DELETE") {
        return "DELETE";
    }
    throw new Error("Invalid ShareRewriteRuleAction");
};

export class RewriteRuleAction extends BaseValueObject<Types> {
    constructor(_value: string) {
        super(StringToType(_value));
    }
}
