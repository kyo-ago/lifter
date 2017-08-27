import {ResolveAllOnMemoryRepository} from "../../../../share/domain/base/lifecycle/resolve-all-on-memory-repository";
import {ShareProxyBypassDomainIdentity} from "../../../../share/domain/share-proxy-bypass-domain/share-proxy-bypass-domain-identity";
import {ProxyBypassDomainEntity} from "../proxy-bypass-domain-entity";

export class ProxyBypassDomainRepository extends ResolveAllOnMemoryRepository<ShareProxyBypassDomainIdentity, ProxyBypassDomainEntity> {
}
