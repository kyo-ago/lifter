import * as AppActions from "./action";
import {StateToProps} from "./components/index";
import {AutoResponderEntryEntity} from "../../domain/auto-responder-entry/auto-responder-entry-entity";
import {ClientRequestEntity} from "../../domain/client-request/client-request-entity";

let initialState: StateToProps = {
    autoResponderEntries: <AutoResponderEntryEntity[]>[],
    clientRequestEntries: <ClientRequestEntity[]>[],
    certificateState: "missing",
    proxySettingStatus: "Off",
};

export function reducer(state = initialState, action: any): StateToProps {
    switch (action.type) {
        case AppActions.ADD_AUTO_RESPONDER:
            return {
                ...state,
                autoResponderEntries: state.autoResponderEntries.concat(action.autoResponderEntryEntity),
            };
        case AppActions.CLICK_CERTIFICATE_STATUS:
            return {
                ...state,
                certificateState: action.certificateState,
            };
        case AppActions.CLICK_PROXY_SETTING_STATUS:
            return {
                ...state,
                proxySettingStatus: action.proxySettingStatus,
            };
        case AppActions.CLIENT_PROXY_REQUEST_EVENT:
            return {
                ...state,
                clientRequestEntries: state.clientRequestEntries.concat(action.clientRequestEntries),
            };
        default:
            return state;
    }
}