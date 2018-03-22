export function getRewriteRuleModifiersDialogModule() {
    return {
        namespaced: true,
        state() {
            return {
                isShowing: false,
                rewriteRoleId: undefined,
            };
        },
        mutations: {
            show(state, rewriteRoleId: number) {
                state.isShowing = true;
                state.rewriteRoleId = rewriteRoleId;
            },
            hide(state) {
                state.isShowing = false;
            },
        },
    };
}
