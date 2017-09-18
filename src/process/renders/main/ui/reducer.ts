import {AbstractAutoResponderEntryEntity} from '../../../../domains/proxy/auto-responder-entry/auto-responder-entry-entity';
import {ClientRequestEntity} from '../../../../domains/proxy/client-request/client-request-entity';
import {ProxySettingStatus} from '../../../../domains/settings/proxy-setting/proxy-setting-entity';
import {CertificateStatus} from '../../../main/certificate/certificate-service';
import * as AppActions from './action';

export interface StateToProps {
    autoResponderEntries: AbstractAutoResponderEntryEntity[],
    clientRequestEntries: ClientRequestEntity[],
    certificateState: CertificateStatus,
    proxySettingStatus: ProxySettingStatus,
}

const initialState: StateToProps = {
    autoResponderEntries: <AbstractAutoResponderEntryEntity[]>[],
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
                clientRequestEntries: state.clientRequestEntries.concat(action.clientRequestEntity),
            };
        default:
            return state;
    }
}