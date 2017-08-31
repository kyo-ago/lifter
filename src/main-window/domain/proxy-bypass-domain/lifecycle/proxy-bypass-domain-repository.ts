import {ResolveAllOnMemoryRepository} from '../../../../share/domain/base/lifecycle/resolve-all-on-memory-repository';
import {ShareProxyBypassDomainIdentity} from '../../../../share/domain/share-proxy-bypass-domain/share-proxy-bypass-domain-identity';
import {ProxyBypassDomainEntity} from '../proxy-bypass-domain-entity';

type E = {
    [key: string]: ProxyBypassDomainEntity;
};

export class ProxyBypassDomainRepository extends ResolveAllOnMemoryRepository<ShareProxyBypassDomainIdentity, ProxyBypassDomainEntity> {
    overwriteAll(entities: ProxyBypassDomainEntity[]) {
        this.entities = entities.reduce((base: E, cur: ProxyBypassDomainEntity) => {
            base[cur.id] = cur;
            return base;
        }, <E>{});
    }
}
