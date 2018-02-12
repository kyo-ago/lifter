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
