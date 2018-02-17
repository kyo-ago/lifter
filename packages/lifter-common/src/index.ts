import * as Ipc from "./ipc";

export const ipc = Ipc.ipc;

export const APPLICATION_NAME = "Lifter Proxy";

export type CertificateStatus = "missing" | "installed";

export type ProxySettingStatus = "On" | "Off";

export type ProxyCommandGrantStatus = "On" | "Off";

export type RewriteRuleActionType = "ADD" | "MODIFY" | "DELETE";

export type AutoResponderEntryType = "File" | "Directory" | "Glob";

export interface ApplicationMainStateJSON {
    autoResponderEntries: AutoResponderEntryEntityJSON[];
    clientRequestEntries: ClientRequestEntityJSON[];
    certificateState: CertificateStatus;
    proxySettingStatus: ProxySettingStatus;
    proxyCommandGrantStatus: ProxyCommandGrantStatus;
    noAutoEnableProxySetting: boolean;
    noPacFileProxySetting: boolean;
}

export interface AutoResponderEntryEntityJSON {
    id: number;
    type: AutoResponderEntryType;
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

export interface RewriteRuleEntityJSON {
    id: number;
    url: string;
    action: RewriteRuleActionType;
    header: string;
    value: string;
}
