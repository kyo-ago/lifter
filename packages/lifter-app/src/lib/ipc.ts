import {
    AutoResponderEntityJSON,
    CertificateStatus,
    ClientRequestEntityJSON,
    CreateRewriteRuleModifierEntityJSON,
    ProxyBypassDomainEntityJSON,
    ProxyCommandGrantStatus,
    ProxySettingStatus,
    RewriteRuleEntityJSON,
    RewriteRuleModifierEntityJSON,
} from "@lifter/lifter-common";
import * as Ipc from "electron-ipc";

export interface addRewriteRuleModifierParam {
    action: string;
    entityId: number;
    param: CreateRewriteRuleModifierEntityJSON;
}

export interface deleteRewriteRuleModifierParam {
    action: string;
    entityId: number;
    modifiers: RewriteRuleModifierEntityJSON[];
}

export interface ElectronIpcMap {
    addAutoResponderEntities: {
        param: string[];
        result: AutoResponderEntityJSON[];
    };
    fetchAutoResponderEntities: {
        param: void;
        result: AutoResponderEntityJSON[];
    };
    deleteAutoResponderEntities: {
        param: number[];
        result: void;
    };

    addClientRequestEntity: {
        param: ClientRequestEntityJSON;
        result: ClientRequestEntityJSON;
    };

    changeCertificateStatus: {
        param: void;
        result: CertificateStatus;
    };
    changeProxySettingStatus: {
        param: void;
        result: ProxySettingStatus;
    };
    changeProxyCommandGrantStatus: {
        param: void;
        result: ProxyCommandGrantStatus;
    };
    changeNoAutoEnableProxySetting: {
        param: void;
        result: boolean;
    };
    changeNoPacFileProxySetting: {
        param: void;
        result: boolean;
    };

    getProxyBypassDomains: {
        param: void;
        result: ProxyBypassDomainEntityJSON[];
    };
    saveProxyBypassDomains: {
        param: ProxyBypassDomainEntityJSON[];
        result: void;
    };

    getRewriteRules: {
        param: void;
        result: RewriteRuleEntityJSON[];
    };
    addRewriteRule: {
        param: string;
        result: RewriteRuleEntityJSON;
    };
    changeRewriteRule: {
        param: RewriteRuleEntityJSON;
        result: RewriteRuleEntityJSON;
    };
    deleteRewriteRules: {
        param: number[];
        result: void;
    };
    addRewriteRuleModifier: {
        param: addRewriteRuleModifierParam;
        result: RewriteRuleModifierEntityJSON;
    };
    deleteRewriteRuleModifiers: {
        param: deleteRewriteRuleModifierParam;
        result: void;
    };
}

export const ipc = class {
    static subscribe<K extends keyof ElectronIpcMap>(
        key: K,
        callback: (event: any, message: ElectronIpcMap[K]["param"]) => Promise<ElectronIpcMap[K]["result"]> | void,
    ): void {
        return Ipc.subscribe(key, callback);
    }
    static publish<K extends keyof ElectronIpcMap>(
        key: K,
        message?: ElectronIpcMap[K]["param"],
    ): Promise<ElectronIpcMap[K]["result"]> {
        return Ipc.publish(key, message);
    }
    static addWindow(window: any) {
        Ipc.addWindow(window);
    }
    static removeWindow(window: any) {
        Ipc.removeWindow(window);
    }
};
