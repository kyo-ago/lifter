"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_value_object_1 = require("../../../base/value-objects/base-value-object");
class RewriteRuleHeader extends base_value_object_1.BaseValueObject {
    constructor(value) {
        super(value.toLowerCase());
    }
}
exports.RewriteRuleHeader = RewriteRuleHeader;
