import {ShareRewriteRuleEntity} from "../../../../domains/share/share-rewrite-rule/share-rewrite-rule-entity";
import {Option} from "monapt";

export const SAVE_REWRITE_RULE = 'SAVE_REWRITE_RULE';
export const UPDATE_REWRITE_RULES = 'UPDATE_REWRITE_RULES';
export const UPDATE_CURRENT_REWRITE_RULE = 'UPDATE_CURRENT_REWRITE_RULE';

export const Actions = {
    saveRewriteRule         : (rewriteRuleEntity: ShareRewriteRuleEntity) => {
        return {
            type: SAVE_REWRITE_RULE,
            rewriteRuleEntity,
        };
    },
    updateRewriteRules      : (rewriteRules: ShareRewriteRuleEntity[]) => {
        return {
            type: UPDATE_REWRITE_RULES,
            rewriteRules,
        };
    },
    updateCurrentRewriteRule: (rewriteRuleEntity: Option<ShareRewriteRuleEntity>) => {
        return {
            type: UPDATE_CURRENT_REWRITE_RULE,
            currentRewriteRule: rewriteRuleEntity,
        };
    },
};
