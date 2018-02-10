import {
    AutoResponderEntryEntityJSON,
    CertificateStatus,
    ClientRequestEntityJSON,
    ProxySettingStatus,
} from "@lifter/lifter-common";
import * as Ipc from "electron-ipc";

interface ElectronIpcMap {
    fetchAutoResponderEntryEntities: AutoResponderEntryEntityJSON[];
    addAutoResponderEntryEntities: AutoResponderEntryEntityJSON[];
    setNewCertificateStatus: CertificateStatus;
    changeNetworkProxyCommandGranted: boolean;
    changeNoAutoEnableProxySetting: boolean;
    changeNoPacFileProxySetting: boolean;
    setNewProxySettingStatus: ProxySettingStatus;
    deleteAutoResponderEntryEntities: void;
    addClientRequestEntity: ClientRequestEntityJSON;
}

export const ipc = class {
    static subscribe<K extends keyof ElectronIpcMap>(
        key: K,
        callback: (event: any, message: any) => Promise<ElectronIpcMap[K]> | void,
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
