import {ProxyBypassDomainEntity} from "../proxy-bypass-domain-entity";
import {ProxyBypassDomainIdentity} from "../proxy-bypass-domain-identity";

export class ProxyBypassDomainFactory {
    private identity = 0;

    create(
    ): ProxyBypassDomainEntity {
        return new ProxyBypassDomainEntity(
            new ProxyBypassDomainIdentity(this.identity++),
        );
    }
}
