import { Option } from "monapt";
import { RewriteRuleEntity } from "../../../../domains/rewrite-rule/rewrite-rule-entity";

export const SAVE_REWRITE_RULE = "SAVE_REWRITE_RULE";
export const UPDATE_REWRITE_RULES = "UPDATE_REWRITE_RULES";
export const UPDATE_CURRENT_REWRITE_RULE = "UPDATE_CURRENT_REWRITE_RULE";

export const Actions = {
    saveRewriteRule: (rewriteRuleEntity: RewriteRuleEntity) => {
        return {
            type: SAVE_REWRITE_RULE,
            rewriteRuleEntity
        };
    },
    updateRewriteRules: (rewriteRules: RewriteRuleEntity[]) => {
        return {
            type: UPDATE_REWRITE_RULES,
            rewriteRules
        };
    },
    updateCurrentRewriteRule: (rewriteRuleEntity: Option<RewriteRuleEntity>) => {
        return {
            type: UPDATE_CURRENT_REWRITE_RULE,
            currentRewriteRule: rewriteRuleEntity
        };
    }
};
