/// <reference types="node" />
import { OutgoingHttpHeaders } from "http";
import { BaseEntity } from "../../base/base-entity";
import { ClientRequestEntity } from "../client-request/client-request-entity";
import { RewriteRuleIdentity } from "./rewrite-rule-identity";
import { RewriteRuleAction, Types } from "./value-objects/rewrite-rule-action";
import { RewriteRuleHeader } from "./value-objects/rewrite-rule-header";
import { RewriteRuleUrlPattern } from "./value-objects/rewrite-rule-url-pattern";
import { RewriteRuleValue } from "./value-objects/rewrite-rule-value";
export interface RewriteRuleEntityJSON {
    id: number;
    url: string;
    action: string;
    header: string;
    value: string;
}
export declare class RewriteRuleEntity extends BaseEntity<RewriteRuleIdentity> {
    private _url;
    private _action;
    private _header;
    private _value;
    constructor(
        identity: RewriteRuleIdentity,
        _url: RewriteRuleUrlPattern,
        _action: RewriteRuleAction,
        _header: RewriteRuleHeader,
        _value: RewriteRuleValue
    );
    readonly url: string;
    readonly action: Types;
    readonly header: string;
    readonly value: string;
    readonly json: RewriteRuleEntityJSON;
    isMatchClientRequest(clientRequestEntity: ClientRequestEntity): boolean;
    applyHeader(header: OutgoingHttpHeaders): OutgoingHttpHeaders;
}
