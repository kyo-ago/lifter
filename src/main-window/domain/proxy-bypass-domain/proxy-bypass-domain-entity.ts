import {ProxyBypassDomainIdentity} from "./proxy-bypass-domain-identity";
import {BaseEntity} from "../../../share/domain/base/base-entity";

export class ProxyBypassDomainEntity extends BaseEntity<ProxyBypassDomainIdentity> {
    constructor(identity: ProxyBypassDomainIdentity,) {
        super(identity);
    }
}
