import { BaseEntity } from "../../base/base-entity";
import { ProxyBypassDomainIdentity } from "./proxy-bypass-domain-identity";
import { ProxyBypassDomainName } from "./vaue-objects/proxy-bypass-domain-name";
export interface ProxyBypassDomainEntityJSON {
    id: number;
    name: string;
}
export declare class ProxyBypassDomainEntity extends BaseEntity<ProxyBypassDomainIdentity> {
    private _name;
    constructor(identity: ProxyBypassDomainIdentity, _name: ProxyBypassDomainName);
    readonly name: string;
    readonly json: ProxyBypassDomainEntityJSON;
}
