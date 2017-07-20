import * as AppActions from "./action";
import {ShareRewriteRuleEntity} from "../../share/domain/share-rewrite-rule/share-rewrite-rule-entity";
import {None, Option} from "monapt";

export interface StateToProps {
    rewriteRules: ShareRewriteRuleEntity[],
    currentRewriteRule: Option<ShareRewriteRuleEntity>,
}

let initialState: StateToProps = {
    rewriteRules: <ShareRewriteRuleEntity[]>[],
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