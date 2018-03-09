import { ClientRequestEntityJSON } from "@lifter/lifter-common";
import { Application } from "../../application/application";

export function getClientRequestModule(_: Application, clientRequestEntries: ClientRequestEntityJSON[]) {
    return {
        namespaced: true,
        state: {
            entries: clientRequestEntries,
        },
        mutations: {
            add(state, clientRequestEntries: ClientRequestEntityJSON) {
                state.entries.unshift(clientRequestEntries);
            },
        },
    };
}
