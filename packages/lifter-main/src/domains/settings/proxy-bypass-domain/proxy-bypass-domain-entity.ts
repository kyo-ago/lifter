import { BaseEntity } from "../../base/base-entity";
import { ProxyBypassDomainIdentity } from "./proxy-bypass-domain-identity";
import { ProxyBypassDomainName } from "./vaue-objects/proxy-bypass-domain-name";

export interface ProxyBypassDomainEntityJSON {
    id: number;
    name: string;
}

export class ProxyBypassDomainEntity extends BaseEntity<ProxyBypassDomainIdentity> {
    constructor(identity: ProxyBypassDomainIdentity, private _name: ProxyBypassDomainName) {
        super(identity);
    }

    get name(): string {
        return this._name.value;
    }

    get json(): ProxyBypassDomainEntityJSON {
        return {
            id: this.id,
            name: this.name
        };
    }
}
