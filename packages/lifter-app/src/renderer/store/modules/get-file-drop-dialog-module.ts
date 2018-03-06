export function getFileDropDialogModule() {
    return {
        namespaced: true,
        state: {
            isShowing: false,
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
