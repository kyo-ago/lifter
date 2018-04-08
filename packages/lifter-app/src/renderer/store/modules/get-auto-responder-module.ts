import { AutoResponderEntityJSON } from "@lifter/lifter-common";
import { Application } from "../../application/application";

export function getAutoResponderModule(application: Application, autoResponders: AutoResponderEntityJSON[]) {
    return {
        namespaced: true,
        state: {
            entries: autoResponders,
        },
        mutations: {
            add(state, autoResponders: AutoResponderEntityJSON[]) {
                state.entries = autoResponders.concat(state.entries);
            },
            save(state, autoResponders: AutoResponderEntityJSON[]) {
                state.entries = autoResponders;
            },
        },
        actions: {
            async add({ commit }, files: File[]) {
                let autoResponders = await application.addDropFiles(files);
                commit("add", autoResponders);
            },
            async deletes({ commit }, targetAutoResponders: AutoResponderEntityJSON[]) {
                await application.deleteAutoResponderEntities(targetAutoResponders);
                let autoResponders = await application.fetchAutoResponderEntities();
                commit("save", autoResponders);
            },
        },
    };
}
