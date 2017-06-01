import {ClientRequestBoxEntry} from "../components/client-request-box";
import {CertificateStatus} from "../../application/certificate/certificate-service";
import {ProxySettingStatus} from "../../application/proxy-setting/proxy-setting-service";
import {AutoResponderEntryEntity} from "../../domain/auto-responder-entry/auto-responder-entry-entity";

export const FILE_DROP                   = 'FILE_DROP';
export const CLIENT_REQUEST              = 'CLIENT_REQUEST';
export const CHANGE_CERTIFICATE_STATUS   = 'CHANGE_CERTIFICATE_STATUS';
export const CHANGE_PROXY_SETTING_STATUS = 'CHANGE_PROXY_SETTING_STATUS';

export default {
    fileDrop: (autoResponderEntry: AutoResponderEntryEntity) => {
        return {
            type: FILE_DROP,
            autoResponderEntry
        };
    },
    clientRequest: (clientRequestEntity: ClientRequestBoxEntry) => {
        return {
            type: CLIENT_REQUEST,
            clientRequestEntity
        };
    },
    changeCirtificateStatus: (certificateBoxStatus: CertificateStatus) => {
        return {
            type: CHANGE_CERTIFICATE_STATUS,
            certificateBoxStatus
        };
    },
    changeProxySettingStatus: (proxySettingBoxStatus: ProxySettingStatus) => {
        return {
            type: CHANGE_PROXY_SETTING_STATUS,
            proxySettingBoxStatus
        };
    },
}