import { ShareProxyBypassDomainIdentity } from "../../../share/share-proxy-bypass-domain/share-proxy-bypass-domain-identity";
import { ShareProxyBypassDomainName } from "../../../share/share-proxy-bypass-domain/vaue-objects/share-proxy-bypass-domain-name";
import { ProxyBypassDomainEntity } from "../proxy-bypass-domain-entity";

export class ProxyBypassDomainFactory {
    static fromJSON(json: any): ProxyBypassDomainEntity {
        return new ProxyBypassDomainEntity(
            new ShareProxyBypassDomainIdentity(json.id),
            new ShareProxyBypassDomainName(json.pattern)
        );
    }
}
