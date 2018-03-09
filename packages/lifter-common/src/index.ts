import * as Ipc from "./ipc";

export const ipc = Ipc.ipc;

export interface ElectronIpcMap extends Ipc.ElectronIpcMap {}

export const APPLICATION_NAME = "Lifter Proxy";

export type CertificateStatus = "missing" | "installed";

export type ProxySettingStatus = "On" | "Off";

export type ProxyCommandGrantStatus = "On" | "Off";

export type RewriteRuleActionType = "UPDATE" | "DELETE";

export type AutoResponderType = "File" | "Directory" | "Glob";

export interface ApplicationMainStateJSON {
    autoResponderEntries: AutoResponderEntityJSON[];
    clientRequestEntries: ClientRequestEntityJSON[];
    proxyBypassDomainEntries: ProxyBypassDomainEntityJSON[];
    rewriteRuleEntries: RewriteRuleEntityJSON[];
    certificateState: CertificateStatus;
    proxySettingStatus: ProxySettingStatus;
    proxyCommandGrantStatus: ProxyCommandGrantStatus;
    noAutoEnableProxySetting: boolean;
    noPacFileProxySetting: boolean;
}

export interface AutoResponderEntityJSON {
    id: number;
    type: AutoResponderType;
    pattern: string;
    path: string;
    projectId: number;
}

export interface ClientRequestEntityJSON {
    id: number;
    href: string;
}

export interface ProxyBypassDomainEntityJSON {
    id: number;
    name: string;
}

export interface RewriteRuleModifierEntityJSON {
    id: number;
    action: RewriteRuleActionType;
    header: string;
    value: string;
}

export interface RewriteRuleEntityJSON {
    id: number;
    url: string;
    modifiers: RewriteRuleModifierEntityJSON[];
}
