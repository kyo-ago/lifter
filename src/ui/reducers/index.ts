import {AutoResponderEntryEntity} from "../../domain/auto-responder-entry/auto-responder-entry-entity";
import {ClientRequestEntity} from "../../domain/client-request/client-request-entity";
import {INIT_LOAD} from "../actions/index";

interface AppState {
    autoResponderEntries: AutoResponderEntryEntity[];
    clientRequestEntries: ClientRequestEntity[];
}

let initialState: AppState = {
    autoResponderEntries: <AutoResponderEntryEntity[]>[],
    clientRequestEntries: <ClientRequestEntity[]>[],
};

export function reducer(state = initialState, action: any): AppState {
    switch(action.type) {
        case INIT_LOAD: {
            return initialState;
        }
        default:
            return state;
    }
}