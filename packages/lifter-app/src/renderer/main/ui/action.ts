import { CertificateStatus, ProxySettingStatus } from "@kyo-ago/lifter-common";
import { AbstractAutoResponderEntryEntity } from "@kyo-ago/lifter-main/src/domains/proxy/auto-responder-entry/auto-responder-entry-entity";
import { AutoResponderEntryIdentity } from "@kyo-ago/lifter-main/src/domains/proxy/auto-responder-entry/auto-responder-entry-identity";
import { ClientRequestEntity } from "@kyo-ago/lifter-main/src/domains/proxy/client-request/client-request-entity";

export const ADD_AUTO_RESPONDER = "ADD_AUTO_RESPONDER";
export const DELETE_AUTO_RESPONDER = "DELETE_AUTO_RESPONDER";
export const CLICK_CERTIFICATE_STATUS = "CLICK_CERTIFICATE_STATUS";
export const CLICK_PROXY_SETTING_STATUS = "CLICK_PROXY_SETTING_STATUS";
export const CLIENT_PROXY_REQUEST_EVENT = "CLIENT_PROXY_REQUEST_EVENT";

export const Actions = {
    addAutoResponder: (autoResponderEntryEntity: AbstractAutoResponderEntryEntity[]) => {
        return {
            type: ADD_AUTO_RESPONDER,
            autoResponderEntryEntity
        };
    },
    deleteAutoResponder: (autoResponderEntryIdentity: AutoResponderEntryIdentity) => {
        return {
            type: DELETE_AUTO_RESPONDER,
            autoResponderEntryIdentity: autoResponderEntryIdentity
        };
    },
    clickCertificateStatus: (certificateState: CertificateStatus) => {
        return {
            type: CLICK_CERTIFICATE_STATUS,
            certificateState
        };
    },
    clickProxySettingStatus: (proxySettingStatus: ProxySettingStatus) => {
        return {
            type: CLICK_PROXY_SETTING_STATUS,
            proxySettingStatus
        };
    },
    clientProxyRequestEvent: (clientRequestEntity: ClientRequestEntity) => {
        return {
            type: CLIENT_PROXY_REQUEST_EVENT,
            clientRequestEntity
        };
    }
};