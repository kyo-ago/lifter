import {AutoResponderEntryEntity} from '../domain/auto-responder-entry/auto-responder-entry-entity';
import {CertificateStatus} from '../application/certificate/certificate-service';
import {ProxySettingStatus} from '../application/proxy-setting/proxy-setting-service';
import {ClientRequestEntity} from "../domain/client-request/client-request-entity";

export const ADD_AUTO_RESPONDER = 'ADD_AUTO_RESPONDER';
export const CLICK_CERTIFICATE_STATUS = 'CLICK_CERTIFICATE_STATUS';
export const CLICK_PROXY_SETTING_STATUS = 'CLICK_PROXY_SETTING_STATUS';
export const CLIENT_PROXY_REQUEST_EVENT = 'CLIENT_PROXY_REQUEST_EVENT';

export const Actions = {
    addAutoResponder: (autoResponderEntryEntity: AutoResponderEntryEntity[]) => {
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
