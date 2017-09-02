import {remote} from 'electron';
import {ShareRewriteRuleEntityJSON} from "../../contexts/share/share-rewrite-rule/share-rewrite-rule-entity";
import {ShareProxyBypassDomainEntityJSON} from "../../contexts/share/share-proxy-bypass-domain/share-proxy-bypass-domain-entity";

type WindowId = "mainWindow" | "rewriteRuleSettingWindow" | "proxyBypassDomainSettingWindow";

interface StoreDateKeyMap {
    "mainRewriteRules": ShareRewriteRuleEntityJSON[];
    "mainProxyBypassDomains": ShareProxyBypassDomainEntityJSON[];
}

interface BridgeDateKeyMap {
    "overwriteRewriteRules": ShareRewriteRuleEntityJSON[];
    "overwriteProxyBypassDomains": ShareProxyBypassDomainEntityJSON[];
}

interface WindowManager {
    sharedData: {
        fetch: <K extends keyof StoreDateKeyMap>(key: K) => StoreDateKeyMap[K];
        set: <K extends keyof StoreDateKeyMap>(key: K, jsons: StoreDateKeyMap[K]) => void;
    };
    bridge: {
        on: <K extends keyof BridgeDateKeyMap>(key: K, callback: (jsons: BridgeDateKeyMap[K]) => void) => void;
        emit: <K extends keyof BridgeDateKeyMap>(key: K, jsons: BridgeDateKeyMap[K]) => void;
    };
    open: (windowId: WindowId, ...args: any[]) => any;
    get: (windowId: WindowId) => any;
}

export const windowManager: WindowManager = remote.require('@kyo-ago/electron-window-manager');
