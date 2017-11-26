"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rewrite_rule_entity_1 = require("../rewrite-rule-entity");
const rewrite_rule_identity_1 = require("../rewrite-rule-identity");
const rewrite_rule_action_1 = require("../value-objects/rewrite-rule-action");
const rewrite_rule_header_1 = require("../value-objects/rewrite-rule-header");
const rewrite_rule_url_pattern_1 = require("../value-objects/rewrite-rule-url-pattern");
const rewrite_rule_value_1 = require("../value-objects/rewrite-rule-value");
class RewriteRuleFactory {
    static fromJSON(json) {
        return new rewrite_rule_entity_1.RewriteRuleEntity(
            new rewrite_rule_identity_1.RewriteRuleIdentity(json.id),
            new rewrite_rule_url_pattern_1.RewriteRuleUrlPattern(json.url),
            new rewrite_rule_action_1.RewriteRuleAction(json.action),
            new rewrite_rule_header_1.RewriteRuleHeader(json.header),
            new rewrite_rule_value_1.RewriteRuleValue(json.value)
        );
    }
}
exports.RewriteRuleFactory = RewriteRuleFactory;
