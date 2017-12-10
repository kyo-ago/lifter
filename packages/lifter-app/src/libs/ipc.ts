import {
    AutoResponderEntryEntityJSON,
    CertificateStatus,
    ClientRequestEntityJSON,
    ProxySettingStatus
} from "@kyo-ago/lifter-common";
import * as Ipc from "electron-ipc";

interface ElectronIpcMap {
    addAutoResponderEntryEntities: AutoResponderEntryEntityJSON[];
    setNewCertificateStatus: CertificateStatus;
    setNewProxySettingStatus: ProxySettingStatus;
    deleteAutoResponderEntryEntity: number;
    addClientRequestEntity: ClientRequestEntityJSON;
    openRewriteRuleSettingWindow: void;
    openProxyBypassDomainSettingWindow: void;
    openPreferencesWindow: void;
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
