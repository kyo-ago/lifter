import { CertificateStatus, ProxySettingStatus } from "@kyo-ago/lifter-common";
import { AbstractAutoResponderEntryEntity } from "@kyo-ago/lifter-main/build/domains/proxy/auto-responder-entry/auto-responder-entry-entity";
import { ClientRequestEntity } from "@kyo-ago/lifter-main/build/domains/proxy/client-request/client-request-entity";
import * as AppActions from "./action";

export interface StateToProps {
    autoResponderEntries: AbstractAutoResponderEntryEntity[];
    clientRequestEntries: ClientRequestEntity[];
    certificateState: CertificateStatus;
    proxySettingStatus: ProxySettingStatus;
}

const initialState: StateToProps = {
    autoResponderEntries: <AbstractAutoResponderEntryEntity[]>[],
    clientRequestEntries: <ClientRequestEntity[]>[],
    certificateState: "missing",
    proxySettingStatus: "Off"
};

export function reducer(state = initialState, action: any): StateToProps {
    switch (action.type) {
        case AppActions.ADD_AUTO_RESPONDER:
            return {
                ...state,
                autoResponderEntries: state.autoResponderEntries.concat(action.autoResponderEntryEntity)
            };
        case AppActions.DELETE_AUTO_RESPONDER:
            return {
                ...state,
                autoResponderEntries: state.autoResponderEntries.filter((entity: AbstractAutoResponderEntryEntity) => {
                    return !entity.getIdentity().equals(action.autoResponderEntryIdentity);
                })
            };
        case AppActions.CLICK_CERTIFICATE_STATUS:
            return {
                ...state,
                certificateState: action.certificateState
            };
        case AppActions.CLICK_PROXY_SETTING_STATUS:
            return {
                ...state,
                proxySettingStatus: action.proxySettingStatus
            };
        case AppActions.CLIENT_PROXY_REQUEST_EVENT:
            return {
                ...state,
                clientRequestEntries: state.clientRequestEntries.concat(action.clientRequestEntity)
            };
        default:
            return state;
    }
}
