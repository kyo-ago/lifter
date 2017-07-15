import {AutoResponderEntryEntity} from '../domain/auto-responder-entry/auto-responder-entry-entity';
import {CertificateStatus} from '../application/certificate/certificate-service';
import {ProxySettingStatus} from '../application/proxy-setting/proxy-setting-service';
import {ClientRequestEntity} from "../domain/client-request/client-request-entity";

export const ADD_REWRITE_RULE_SET = 'ADD_REWRITE_RULE_SET';
export const CHANGE_REWRITE_RULE_SET = 'CHANGE_REWRITE_RULE_SET';
export const DELETE_REWRITE_RULE_SET = 'DELETE_REWRITE_RULE_SET';
export const SAVE_REWRITE_RULES = 'SAVE_REWRITE_RULES';

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
