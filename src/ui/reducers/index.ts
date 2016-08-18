import {AutoResponderEntryEntity} from "../../domain/auto-responder-entry/auto-responder-entry-entity";
import {ClientRequestEntity} from "../../domain/client-request/client-request-entity";

interface AppState {
    autoResponderEntries: AutoResponderEntryEntity[];
    clientRequestEntries: ClientRequestEntity[];
}

let initialState: AppState = {
    autoResponderEntries: <AutoResponderEntryEntity[]>[],
    clientRequestEntries: <ClientRequestEntity[]>[],
};

export function reducer(state = initialState, action): AppState {
    switch(action.type) {
        case 'INCREMENT': {
            return initialState;
        }
        default:
            return state;
    }
}