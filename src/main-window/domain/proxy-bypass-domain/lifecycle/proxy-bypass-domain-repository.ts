import {OnMemoryRepository} from "typescript-dddbase";
import {ProxyBypassDomainEntity} from "../proxy-bypass-domain-entity";
import {ProxyBypassDomainIdentity} from "../proxy-bypass-domain-identity";

export class ProxyBypassDomainRepository extends OnMemoryRepository<ProxyBypassDomainIdentity, ProxyBypassDomainEntity> {
}
