import * as Ipc from 'electron-ipc';
import {AutoResponderEntryEntityJSON} from '../domains/proxy/auto-responder-entry/auto-responder-entry-entity';
import {ClientRequestEntityJSON} from '../domains/proxy/client-request/client-request-entity';
import {ProxySettingStatus} from '../domains/settings/proxy-setting/proxy-setting-entity';
import {CertificateStatus} from '../process/main/certificate/certificate-service';

interface ElectronIpcMap {
    addAutoResponderEntryEntities: AutoResponderEntryEntityJSON[];
    setNewCertificateStatus: CertificateStatus;
    setNewProxySettingStatus: ProxySettingStatus;
    addClientRequestEntity: ClientRequestEntityJSON;
    openRewriteRuleSettingWindow: void;
    openProxyBypassDomainSettingWindow: void;
}

export const ipc = class {
    static on<K extends keyof ElectronIpcMap>(key: K, callback: (message: any) => (Promise<ElectronIpcMap[K]> | void)): void {
        return Ipc.on(key, callback);
    }
    static publish<K extends keyof ElectronIpcMap>(key: K, message?: any): Promise<ElectronIpcMap[K]> {
        return Ipc.publish(key, message);
    }
};
