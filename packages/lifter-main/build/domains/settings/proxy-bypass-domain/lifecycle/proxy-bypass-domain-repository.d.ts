import { AsyncOnNedbRepository } from "../../../base/async-on-nedb-repository";
import { ProjectEntity } from "../../../proxy/project/project-entity";
import { ProxyBypassDomainEntity } from "../proxy-bypass-domain-entity";
import { ProxyBypassDomainIdentity } from "../proxy-bypass-domain-identity";
export declare class ProxyBypassDomainRepository extends AsyncOnNedbRepository<
    ProxyBypassDomainIdentity,
    ProxyBypassDomainEntity
> {
    constructor(projectEntity: ProjectEntity);
}
