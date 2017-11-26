"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_value_object_1 = require("../../../base/value-objects/base-value-object");
const StringToType = value => {
    if (value === "ADD") {
        return "ADD";
    } else if (value === "MODIFY") {
        return "MODIFY";
    } else if (value === "DELETE") {
        return "DELETE";
    }
    throw new Error("Invalid ShareRewriteRuleAction");
};
class RewriteRuleAction extends base_value_object_1.BaseValueObject {
    constructor(_value) {
        super(StringToType(_value));
    }
}
exports.RewriteRuleAction = RewriteRuleAction;
