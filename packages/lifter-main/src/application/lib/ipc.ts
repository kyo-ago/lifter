import * as Ipc from "electron-ipc";
import { AutoResponderEntryEntityJSON } from "../../domains/proxy/auto-responder-entry/auto-responder-entry-entity";
import { CertificateStatus } from "../certificate/certificate-service";
import { ProxySettingStatus } from "../../domains/settings/proxy-setting/proxy-setting-service";

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
