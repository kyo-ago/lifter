import { AutoResponderEntityJSON, } from "@lifter/lifter-common";
import { Application } from "../../application/application";

export function getAutoResponderModule(application: Application, autoResponders: AutoResponderEntityJSON[]) {
    return {
        namespaced: true,
        state: {
            entries: autoResponders,
        },
        mutations: {
            add(state, autoResponderEntries: AutoResponderEntityJSON[]) {
                state.entries = autoResponderEntries.concat(state.entries);
            },
            overwrite(state, autoResponderEntries: AutoResponderEntityJSON[]) {
                state.entries = autoResponderEntries;
            },
        },
        actions: {
            async add({ commit }, files: File[]) {
                let autoResponderEntries = await application.addDropFiles(files);
                commit("add", autoResponderEntries);
            },
            async delete({ commit }, targetAutoResponderEntries: AutoResponderEntityJSON[]) {
                await application.deleteAutoResponderEntities(targetAutoResponderEntries);
                let autoResponderEntries = await application.fetchAutoResponderEntities();
                commit("overwrite", autoResponderEntries);
            },
        },
    };
}
