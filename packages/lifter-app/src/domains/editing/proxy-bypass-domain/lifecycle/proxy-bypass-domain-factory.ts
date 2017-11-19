import { ShareProxyBypassDomainEntityJSON } from "../../../share/share-proxy-bypass-domain/share-proxy-bypass-domain-entity";
import { ShareProxyBypassDomainIdentity } from "../../../share/share-proxy-bypass-domain/share-proxy-bypass-domain-identity";
import { ShareProxyBypassDomainName } from "../../../share/share-proxy-bypass-domain/vaue-objects/share-proxy-bypass-domain-name";
import { ProxyBypassDomainEntity } from "../proxy-bypass-domain-entity";

export class ProxyBypassDomainFactory {
    private identity = 0;

    create(name: string): ProxyBypassDomainEntity {
        return new ProxyBypassDomainEntity(
            new ShareProxyBypassDomainIdentity(this.identity++),
            new ShareProxyBypassDomainName(name)
        );
    }

    fromJSON(json: ShareProxyBypassDomainEntityJSON): ProxyBypassDomainEntity {
        this.identity = Math.max(json.id, this.identity);

        return new ProxyBypassDomainEntity(
            new ShareProxyBypassDomainIdentity(json.id),
            new ShareProxyBypassDomainName(json.name)
        );
    }
}
