import { AutoResponderEntryEntityJSON, CertificateStatus, ProxySettingStatus } from "@lifter/lifter-common";
import * as Ipc from "electron-ipc";

export interface ElectronIpcMap {
    fetchAutoResponderEntryEntities: AutoResponderEntryEntityJSON[];
    addAutoResponderEntryEntities: AutoResponderEntryEntityJSON[];
    setNewCertificateStatus: CertificateStatus;
    changeNoAutoGrantRequestSetting: boolean;
    changeNoAutoEnableProxySetting: boolean;
    changeNoPacFileProxySetting: boolean;
    setNewProxySettingStatus: ProxySettingStatus;
    deleteAutoResponderEntryEntities: void;
}

export const ipc = class {
    static subscribe<K extends keyof ElectronIpcMap>(
        key: K,
        callback: (event: any, message: any) => Promise<ElectronIpcMap[K]> | void
    ): void {
        return Ipc.subscribe(key, callback);
    }
};
