export function getHeaderTabModule() {
    return {
        namespaced: true,
        state: {
            index: 0,
        },
        mutations: {
            change(state, index: number) {
                state.index = index;
            },
            selectAutoResponder(state) {
                state.index = 1;
            },
        },
    };
}
