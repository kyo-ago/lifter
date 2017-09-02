import {None, Option} from "monapt";
import {RewriteRuleEntity} from "../../../contexts/settings/rewrite-rule/rewrite-rule-entity";
import * as AppActions from "./action";

export interface StateToProps {
    rewriteRules: RewriteRuleEntity[],
    currentRewriteRule: Option<RewriteRuleEntity>,
}

let initialState: StateToProps = {
    rewriteRules: <RewriteRuleEntity[]>[],
    currentRewriteRule: None,
};

export function reducer(state = initialState, action: any): StateToProps {
    switch (action.type) {
        case AppActions.SAVE_REWRITE_RULE:
            return {
                ...state,
                rewriteRules: state.rewriteRules.concat(action.rewriteRuleEntity),
            };
        case AppActions.UPDATE_REWRITE_RULES:
            return {
                ...state,
                rewriteRules: action.rewriteRules,
            };
        case AppActions.UPDATE_CURRENT_REWRITE_RULE:
            return {
                ...state,
                currentRewriteRule: action.currentRewriteRule,
            };
        default:
            return state;
    }
}