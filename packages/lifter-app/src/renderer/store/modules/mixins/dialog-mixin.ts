export function DialogMixin() {
    return {
        namespaced: true,
        state() {
            return {
                isShowing: false,
            };
        },
        mutations: {
            show(state) {
                state.isShowing = true;
            },
            hide(state) {
                state.isShowing = false;
            },
        },
    };
}
