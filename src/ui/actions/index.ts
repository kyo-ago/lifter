import {AutoResponderBoxEntry} from "../components/auto-responder-box";
import {ClientRequestBoxEntry} from "../components/client-request-box";
import {CertificateStatus} from "../../domain/certificate/certificate-service";
import {ProxySettingStatus} from "../../domain/proxy-setting/proxy-setting-service";

export const FILE_DROP                   = 'FILE_DROP';
export const CLIENT_REQUEST              = 'CLIENT_REQUEST';
export const CHANGE_CERTIFICATE_STATUS   = 'CHANGE_CERTIFICATE_STATUS';
export const CHANGE_PROXY_SETTING_STATUS = 'CHANGE_PROXY_SETTING_STATUS';

export default {
    fileDrop: (autoResponderBoxEntry: AutoResponderBoxEntry) => {
        return {
            type: FILE_DROP,
            autoResponderBoxEntry
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