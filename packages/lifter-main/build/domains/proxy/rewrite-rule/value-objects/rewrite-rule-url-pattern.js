"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const micromatch = require("micromatch");
const base_value_object_1 = require("../../../base/value-objects/base-value-object");
class RewriteRuleUrlPattern extends base_value_object_1.BaseValueObject {
    isMatchUrl(url) {
        return micromatch.isMatch(url, this.value, {
            matchBase: true
        });
    }
}
exports.RewriteRuleUrlPattern = RewriteRuleUrlPattern;
