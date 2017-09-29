import {OnMemoryRepository} from "typescript-dddbase";
import {ResolveAll} from "../../../libs/resolve-all";
import {ShareProxyBypassDomainIdentity} from '../../../share/share-proxy-bypass-domain/share-proxy-bypass-domain-identity';
import {ProxyBypassDomainEntity} from '../proxy-bypass-domain-entity';

type E = {
    [key: string]: ProxyBypassDomainEntity;
};

export class ProxyBypassDomainRepository extends OnMemoryRepository<ShareProxyBypassDomainIdentity, ProxyBypassDomainEntity> {
    overwriteAll(entities: ProxyBypassDomainEntity[]) {
        this.entities = entities.reduce((base: E, cur: ProxyBypassDomainEntity) => {
            base[cur.id] = cur;
            return base;
        }, <E>{});
    }

    resolveAll(): ProxyBypassDomainEntity[] {
        return ResolveAll(this.entities);
    }
}
