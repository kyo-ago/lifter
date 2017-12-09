import { AutoResponderEntryEntityJSON, CertificateStatus, ProxySettingStatus } from "@kyo-ago/lifter-common";
import * as Ipc from "electron-ipc";

export interface ElectronIpcMap {
    addAutoResponderEntryEntities: AutoResponderEntryEntityJSON[];
    setNewCertificateStatus: CertificateStatus;
    setNewProxySettingStatus: ProxySettingStatus;
    deleteAutoResponderEntryEntity: number;
}

export const ipc = class {
    static subscribe<K extends keyof ElectronIpcMap>(
        key: K,
        callback: (event: any, message: any) => Promise<ElectronIpcMap[K]> | void
    ): void {
        return Ipc.subscribe(key, callback);
    }
};
