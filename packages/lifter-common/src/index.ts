import { BaseEntity as BaseEntity_ } from "./domains/base/base-entity";
import { BaseValueObject as BaseValueObject_ } from "./domains/base/value-objects/base-value-object";
import { ResolveAll as ResolveAll_ } from "./lib/resolve-all";

export const ResolveAll = ResolveAll_;

export const BaseEntity = BaseEntity_;

export const BaseValueObject = BaseValueObject_;

export const APPLICATION_NAME = "Lifter Proxy";

export type AutoResponderEntryType = "File" | "Directory" | "Glob";

export interface AutoResponderEntryEntityJSON {
    id: number;
    type: AutoResponderEntryType;
    pattern: string;
    path: string;
    projectId: number;
}

export type CertificateStatus = "missing" | "installed";

export interface ClientRequestEntityJSON {
    id: number;
    href: string;
}

export interface ProxyBypassDomainEntityJSON {
    id: number;
    name: string;
}

export type ProxySettingStatus = "NoPermission" | "On" | "Off";

export type RewriteRuleActionType = "ADD" | "MODIFY" | "DELETE";

export interface RewriteRuleEntityJSON {
    id: number;
    url: string;
    action: RewriteRuleActionType;
    header: string;
    value: string;
}

export interface PreferencesJSON {}
