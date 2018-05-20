import {
    AutoEnableProxyStatus,
    AutoResponderEntityJSON,
    CertificateStatus,
    ClientRequestEntityJSON,
    CreateRewriteRuleModifierEntityJSON,
    PacFileProxyStatus,
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

export interface ChangeCertificateStatusParam {
    status: CertificateStatus;
    command: string[];
}

export interface ChangeProxyCommandGrantStatusParam {
    status: ProxyCommandGrantStatus;
    command: string[];
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
        result: ChangeCertificateStatusParam;
    };
    onChangeCertificateStatus: {
        param: ChangeCertificateStatusParam;
        result: ChangeCertificateStatusParam;
    };
    changeProxySettingStatus: {
        param: void;
        result: ProxySettingStatus;
    };
    onChangeProxySettingService: {
        param: ProxySettingStatus;
        result: ProxySettingStatus;
    };
    changeProxyCommandGrantStatus: {
        param: void;
        result: ChangeProxyCommandGrantStatusParam;
    };
    onChangeProxyCommandGrantStatus: {
        param: ChangeProxyCommandGrantStatusParam;
        result: ChangeProxyCommandGrantStatusParam;
    };
    changeAutoEnableProxySetting: {
        param: void;
        result: AutoEnableProxyStatus;
    };
    changePacFileProxySetting: {
        param: void;
        result: PacFileProxyStatus;
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
        callback: (
            event: any,
            message: ElectronIpcMap[K]["param"],
        ) => Promise<ElectronIpcMap[K]["result"]> | void,
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
