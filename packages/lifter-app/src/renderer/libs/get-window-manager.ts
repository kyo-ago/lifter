import { ProxyBypassDomainEntityJSON, RewriteRuleEntityJSON } from "@kyo-ago/lifter-common";
import { remote } from "electron";
import { StateToProps } from "../main/ui/reducer";

type WindowId = "mainWindow" | "rewriteRuleSettingWindow" | "proxyBypassDomainSettingWindow";

interface StoreDateKeyMap {
    mainApps: StateToProps;
    mainRewriteRules: RewriteRuleEntityJSON[];
    mainProxyBypassDomains: ProxyBypassDomainEntityJSON[];
}

interface BridgeDateKeyMap {
    overwriteRewriteRules: RewriteRuleEntityJSON[];
    overwriteProxyBypassDomains: ProxyBypassDomainEntityJSON[];
}

interface WindowManager {
    sharedData: {
        fetch: <K extends keyof StoreDateKeyMap>(key: K) => StoreDateKeyMap[K];
        set: <K extends keyof StoreDateKeyMap>(key: K, jsons: StoreDateKeyMap[K]) => void;
        watch: (name: string, callback: (props: any, action: string, newValue: any, oldValue: any) => void) => void;
    };
    bridge: {
        on: <K extends keyof BridgeDateKeyMap>(key: K, callback: (jsons: BridgeDateKeyMap[K]) => void) => void;
        emit: <K extends keyof BridgeDateKeyMap>(key: K, jsons: BridgeDateKeyMap[K]) => void;
    };
    open: (windowId: WindowId, ...args: any[]) => any;
    get: (windowId: WindowId) => any;
}

export const windowManager: WindowManager = remote.require("@kyo-ago/electron-window-manager");
