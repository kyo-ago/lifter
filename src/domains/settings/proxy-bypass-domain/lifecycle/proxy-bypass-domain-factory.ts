import {ShareProxyBypassDomainEntityJSON} from '../../../share/share-proxy-bypass-domain/share-proxy-bypass-domain-entity';
import {ShareProxyBypassDomainIdentity} from '../../../share/share-proxy-bypass-domain/share-proxy-bypass-domain-identity';
import {ShareProxyBypassDomainPattern} from '../../../share/share-proxy-bypass-domain/vaue-objects/share-proxy-bypass-domain-pattern';
import {ProxyBypassDomainEntity} from '../proxy-bypass-domain-entity';

export class ProxyBypassDomainFactory {
    private identity = 0;

    create(
        pattern: string,
    ): ProxyBypassDomainEntity {
        return new ProxyBypassDomainEntity(
            new ShareProxyBypassDomainIdentity(this.identity++),
            new ShareProxyBypassDomainPattern(pattern),
        );
    }

    fromJSON(json: ShareProxyBypassDomainEntityJSON): ProxyBypassDomainEntity {
        return new ProxyBypassDomainEntity(
            new ShareProxyBypassDomainIdentity(json.id),
            new ShareProxyBypassDomainPattern(json.pattern),
        );
    }
}
