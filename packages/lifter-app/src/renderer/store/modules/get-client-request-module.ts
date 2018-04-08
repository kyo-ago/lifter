import { ClientRequestEntityJSON } from "@lifter/lifter-common";
import { Application } from "../../application/application";

export function getClientRequestModule(_: Application, clientRequests: ClientRequestEntityJSON[]) {
    return {
        namespaced: true,
        state: {
            entries: clientRequests,
        },
        mutations: {
            add(state, clientRequest: ClientRequestEntityJSON) {
                state.entries.unshift(clientRequest);
            },
        },
    };
}
