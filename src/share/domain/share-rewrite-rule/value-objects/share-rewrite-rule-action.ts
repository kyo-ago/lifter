import {BaseValueObject} from '../../base/value-objects/base-value-object';

export type ACTION = "ADD" | "MODIFY" | "DELETE";

const StringToAction = (value: string): ACTION => {
    if (value === "ADD") {
        return "ADD";
    } else if (value === "MODIFY") {
        return "MODIFY";
    } else if (value === "DELETE") {
        return "DELETE";
    }
    throw new Error("Invalid rewrite rule action");
};

export class ShareRewriteRuleAction extends BaseValueObject<ACTION> {
    constructor(
        _value: string,
    ) {
        super(StringToAction(_value));
    }
}
