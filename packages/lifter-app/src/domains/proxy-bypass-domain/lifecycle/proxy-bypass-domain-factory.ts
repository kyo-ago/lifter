import { ProxyBypassDomainIdentity } from "../proxy-bypass-domain-identity";
import { ProxyBypassDomainName } from "../vaue-objects/proxy-bypass-domain-name";
import { ProxyBypassDomainEntity, ProxyBypassDomainEntityJSON } from "../proxy-bypass-domain-entity";

export class ProxyBypassDomainFactory {
    private identity = 0;

    create(name: string): ProxyBypassDomainEntity {
        return new ProxyBypassDomainEntity(
            new ProxyBypassDomainIdentity(this.identity++),
            new ProxyBypassDomainName(name)
        );
    }

    fromJSON(json: ProxyBypassDomainEntityJSON): ProxyBypassDomainEntity {
        this.identity = Math.max(json.id, this.identity);

        return new ProxyBypassDomainEntity(
            new ProxyBypassDomainIdentity(json.id),
            new ProxyBypassDomainName(json.name)
        );
    }
}
