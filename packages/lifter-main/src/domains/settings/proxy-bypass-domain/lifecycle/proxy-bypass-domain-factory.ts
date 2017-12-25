import { ProxyBypassDomainEntity } from "../proxy-bypass-domain-entity";
import { ProxyBypassDomainIdentity } from "../proxy-bypass-domain-identity";
import { ProxyBypassDomainName } from "../vaue-objects/proxy-bypass-domain-name";

export class ProxyBypassDomainFactory {
    static fromJSON(json: any): ProxyBypassDomainEntity {
        return new ProxyBypassDomainEntity(
            new ProxyBypassDomainIdentity(json.id),
            new ProxyBypassDomainName(json.pattern)
        );
    }
}
