import {ShareProxyBypassDomainEntity} from '../../share/domain/share-proxy-bypass-domain/share-proxy-bypass-domain-entity';
import {ShareProxyBypassDomainIdentity} from '../../share/domain/share-proxy-bypass-domain/share-proxy-bypass-domain-identity';
import {ShareProxyBypassDomainPattern} from '../../share/domain/share-proxy-bypass-domain/vaue-objects/share-proxy-bypass-domain-pattern';

export class ProxyBypassDomainEntity extends ShareProxyBypassDomainEntity {
    constructor(
        identity: ShareProxyBypassDomainIdentity,
        pattern: ShareProxyBypassDomainPattern,
    ) {
        super(identity, pattern);
    }
}
