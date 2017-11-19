import * as Ipc from "electron-ipc";
import { AutoResponderEntryEntityJSON } from "../domains/proxy/auto-responder-entry/auto-responder-entry-entity";
import { ClientRequestEntityJSON } from "../domains/proxy/client-request/client-request-entity";
import { ProxySettingStatus } from "../domains/settings/proxy-setting/proxy-setting-service";
import { CertificateStatus } from "../process/main/certificate/certificate-service";

interface ElectronIpcMap {
    addAutoResponderEntryEntities: AutoResponderEntryEntityJSON[];
    setNewCertificateStatus: CertificateStatus;
    setNewProxySettingStatus: ProxySettingStatus;
    deleteAutoResponderEntryEntity: number;
    addClientRequestEntity: ClientRequestEntityJSON;
    openRewriteRuleSettingWindow: void;
    openProxyBypassDomainSettingWindow: void;
}

export const ipc = class {
    static subscribe<K extends keyof ElectronIpcMap>(
        key: K,
        callback: (event: any, message: any) => Promise<ElectronIpcMap[K]> | void
    ): void {
        return Ipc.subscribe(key, callback);
    }
    static publish<K extends keyof ElectronIpcMap>(key: K, message?: any): Promise<ElectronIpcMap[K]> {
        return Ipc.publish(key, message);
    }
    static addWindow(window: any) {
        Ipc.addWindow(window);
    }
    static removeWindow(window: any) {
        Ipc.removeWindow(window);
    }
};
