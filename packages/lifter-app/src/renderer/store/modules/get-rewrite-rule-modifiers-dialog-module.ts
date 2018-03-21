import { RewriteRuleEntityJSON } from "@lifter/lifter-common";

export function getRewriteRuleModifiersDialogModule() {
    return {
        namespaced: true,
        state() {
            return {
                isShowing: false,
                rewriteRole: undefined,
            };
        },
        mutations: {
            show(state, rewriteRole: RewriteRuleEntityJSON) {
                state.isShowing = true;
                state.rewriteRole = rewriteRole;
            },
            hide(state) {
                state.isShowing = false;
            },
        },
    };
}
