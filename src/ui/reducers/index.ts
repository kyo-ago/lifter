import {AutoResponderEntryEntity} from "../../domain/auto-responder-entry/auto-responder-entry-entity";
import {ClientRequestEntity} from "../../domain/client-request/client-request-entity";
import * as AppActions from "../actions/index";

interface AppState {
    autoResponderEntries: AutoResponderEntryEntity[];
    clientRequestEntries: ClientRequestEntity[];
}

let initialState: AppState = {
    autoResponderEntries: <AutoResponderEntryEntity[]>[],
    clientRequestEntries: <ClientRequestEntity[]>[],
};

export function reducer(state = initialState, action: any): AppState {
    switch (action.type) {
        case AppActions.INIT_LOAD: {
            return Object.assign({}, state, {});
        }
        case AppActions.FILE_DROP: {
            return Object.assign({}, state, {});
        }
        case AppActions.CLIENT_REQUEST: {
            return Object.assign({}, state, {});
        }
        default:
            return state;
    }
}