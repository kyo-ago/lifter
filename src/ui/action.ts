import {AutoResponderEntryEntity} from '../domain/auto-responder-entry/auto-responder-entry-entity';
import {CertificateStatus} from '../application/certificate/certificate-service';
import {ProxySettingStatus} from '../application/proxy-setting/proxy-setting-service';
import {ClientRequestEntity} from "../domain/client-request/client-request-entity";

export const FILE_DROP = 'FILE_DROP';
export const SELECT_DIALOG_ENTRY = 'SELECT_DIALOG_ENTRY';
export const CLICK_CERTIFICATE_STATUS = 'CLICK_CERTIFICATE_STATUS';
export const CLICK_PROXY_SETTING_STATUS = 'CLICK_PROXY_SETTING_STATUS';
export const CLIENT_PROXY_REQUEST_EVENT = 'CLIENT_PROXY_REQUEST_EVENT';

export var Actions = {
    fileDrop: (autoResponderEntryEntity: AutoResponderEntryEntity[]) => {
        return {
            type: FILE_DROP,
            autoResponderEntryEntity,
        };
    },
    selectDialogEntry: (autoResponderEntryEntity: AutoResponderEntryEntity[]) => {
        return {
            type: SELECT_DIALOG_ENTRY,
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
