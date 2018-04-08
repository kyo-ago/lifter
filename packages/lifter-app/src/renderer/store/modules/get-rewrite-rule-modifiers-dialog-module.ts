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
                state.rewriteRoleId = rewriteRoleId;
                state.isShowing = true;
            },
            hide(state) {
                state.isShowing = false;
            },
        },
    };
}
