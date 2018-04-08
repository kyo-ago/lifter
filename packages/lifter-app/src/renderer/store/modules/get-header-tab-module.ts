export const HeaderTabs = ["Connection", "Auto responder", "Rewrite rule", "Proxy bypass domain"];
export const HeaderTabNameToIndex = HeaderTabs.reduce((base, _, index, array) => {
    base[array[index]] = index;
    return base;
}, {});

export function getHeaderTabModule() {
    return {
        namespaced: true,
        state: {
            index: 0,
        },
        mutations: {
            changeIndex(state, index: number) {
                state.index = index;
            },
            changeName(state, name: string) {
                state.index = HeaderTabNameToIndex[name];
            },
        },
    };
}
