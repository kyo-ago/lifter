import * as AppActions from "../actions/index";
import {Action} from "../actions/index";
import {StateToProps} from "../components/index";
import {AutoResponderEntryEntity} from "../../domain/auto-responder-entry/auto-responder-entry-entity";
import {ClientRequestEntity} from "../../domain/client-request/client-request-entity";

let initialState: StateToProps = {
    autoResponderEntries: <AutoResponderEntryEntity[]>[],
    clientRequestEntries: <ClientRequestEntity[]>[],
    certificateState: "missing",
    proxySettingStatus: "Off",
};

export function reducer(state = initialState, action: Action): StateToProps {
    switch (action.type) {
        case AppActions.RENDER: {
            return Object.assign({}, state, { ...action.render });
        }
        default:
            return state;
    }
}