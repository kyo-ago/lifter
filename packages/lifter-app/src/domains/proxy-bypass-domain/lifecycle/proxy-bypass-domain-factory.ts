import { ProxyBypassDomainEntityJSON } from "@lifter/lifter-common";
import { ProxyBypassDomainEntity } from "../proxy-bypass-domain-entity";
import { ProxyBypassDomainIdentity } from "../proxy-bypass-domain-identity";
import { ProxyBypassDomainName } from "../vaue-objects/proxy-bypass-domain-name";

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
