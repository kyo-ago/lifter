import * as Ipc from "electron-ipc";
import {
    AutoResponderEntryEntityJSON,
    CertificateStatus,
    ClientRequestEntityJSON,
    ProxyCommandGrantStatus,
    ProxySettingStatus,
} from "./index";

export interface ElectronIpcMap {
    fetchAutoResponderEntryEntities: AutoResponderEntryEntityJSON[];
    addAutoResponderEntryEntities: AutoResponderEntryEntityJSON[];
    changeCertificateStatus: CertificateStatus;
    changeProxySettingStatus: ProxySettingStatus;
    changeProxyCommandGrantStatus: ProxyCommandGrantStatus;
    changeNoAutoEnableProxySetting: boolean;
    changeNoPacFileProxySetting: boolean;
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
