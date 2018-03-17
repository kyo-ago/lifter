import {
    AutoResponderEntityJSON,
    CertificateStatus,
    ClientRequestEntityJSON,
    ProxyBypassDomainEntityJSON,
    ProxyCommandGrantStatus,
    ProxySettingStatus,
    RewriteRuleEntityJSON,
    RewriteRuleModifierEntityJSON,
} from "@lifter/lifter-common";
import * as Ipc from "electron-ipc";

export interface ElectronIpcMap {
    addAutoResponderEntities: AutoResponderEntityJSON[];
    fetchAutoResponderEntities: AutoResponderEntityJSON[];
    deleteAutoResponderEntities: void;

    addClientRequestEntity: ClientRequestEntityJSON;

    changeCertificateStatus: CertificateStatus;
    changeProxySettingStatus: ProxySettingStatus;
    changeProxyCommandGrantStatus: ProxyCommandGrantStatus;
    changeNoAutoEnableProxySetting: boolean;
    changeNoPacFileProxySetting: boolean;

    getProxyBypassDomains: ProxyBypassDomainEntityJSON[];
    saveProxyBypassDomains: void;

    getRewriteRules: RewriteRuleEntityJSON[];
    addRewriteRule: RewriteRuleEntityJSON;
    changeRewriteRule: RewriteRuleEntityJSON;
    deleteRewriteRule: void;
    addRewriteRuleModifier: RewriteRuleModifierEntityJSON;
    deleteRewriteRuleModifier: void;
}

export const ipc = class {
    static subscribe<K extends keyof ElectronIpcMap>(
        key: K,
        callback: (event: any, ...messages: any[]) => Promise<ElectronIpcMap[K]> | void,
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
