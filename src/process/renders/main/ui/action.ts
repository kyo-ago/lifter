import {AbstractAutoResponderEntryEntity} from "../../../../domains/proxy/auto-responder-entry/auto-responder-entry-entity";
import {ClientRequestEntity} from "../../../../domains/proxy/client-request/client-request-entity";
import {CertificateStatus} from "../application/certificate/certificate-service";
import {ProxySettingStatus} from "../../../../domains/settings/proxy-setting/proxy-setting-entity";

export const ADD_AUTO_RESPONDER = 'ADD_AUTO_RESPONDER';
export const CLICK_CERTIFICATE_STATUS = 'CLICK_CERTIFICATE_STATUS';
export const CLICK_PROXY_SETTING_STATUS = 'CLICK_PROXY_SETTING_STATUS';
export const CLIENT_PROXY_REQUEST_EVENT = 'CLIENT_PROXY_REQUEST_EVENT';

export const Actions = {
    addAutoResponder: (autoResponderEntryEntity: AbstractAutoResponderEntryEntity[]) => {
        return {
            type: ADD_AUTO_RESPONDER,
            autoResponderEntryEntity,
        };
    },
    clickCertificateStatus: (certificateState: CertificateStatus) => {
        return {
            type: CLICK_CERTIFICATE_STATUS,
            certificateState,
        };
    },
    clickProxySettingStatus: (proxySettingStatus: ProxySettingStatus) => {
        return {
            type: CLICK_PROXY_SETTING_STATUS,
            proxySettingStatus,
        };
    },
    clientProxyRequestEvent: (clientRequestEntity: ClientRequestEntity) => {
        return {
            type: CLIENT_PROXY_REQUEST_EVENT,
            clientRequestEntity,
        };
    },
};
