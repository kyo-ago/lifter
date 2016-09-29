import {AutoResponderEntryEntity} from "../../domain/auto-responder-entry/auto-responder-entry-entity";
import * as AppActions from "../actions/index";
import {ClientRequestBoxEntry} from "../components/client-request-box";

export interface AppState {
    autoResponderEntries: AutoResponderEntryEntity[];
    clientRequestEntries: ClientRequestBoxEntry[];
}

let initialState: AppState = {
    autoResponderEntries: <AutoResponderEntryEntity[]>[],
    clientRequestEntries: <ClientRequestBoxEntry[]>[],
};

export function reducer(state = initialState, action: any): AppState {
    switch (action.type) {
        case AppActions.INIT_LOAD: {
            return Object.assign({}, state, {});
        }
        case AppActions.FILE_DROP: {
            return Object.assign({}, state, {
                autoResponderEntries: state.autoResponderEntries.concat(action.autoResponderBoxEntry)
            });
        }
        case AppActions.CLIENT_REQUEST: {
            return Object.assign({}, state, {
                clientRequestEntries: state.clientRequestEntries.concat(action.clientRequestEntity)
            });
        }
        default:
            return state;
    }
}