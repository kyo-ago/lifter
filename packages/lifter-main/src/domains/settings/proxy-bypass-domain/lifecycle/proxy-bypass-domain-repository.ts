import { AsyncOnNedbRepository } from "../../../base/async-on-nedb-repository";
import { ProjectEntity } from "../../../proxy/project/project-entity";
import { ProxyBypassDomainEntity } from "../proxy-bypass-domain-entity";
import { ProxyBypassDomainIdentity } from "../proxy-bypass-domain-identity";
import { ProxyBypassDomainFactory } from "./proxy-bypass-domain-factory";

export class ProxyBypassDomainRepository extends AsyncOnNedbRepository<
    ProxyBypassDomainIdentity,
    ProxyBypassDomainEntity
> {
    constructor(projectEntity: ProjectEntity) {
        super(projectEntity.getDataStoreOptions("proxyBypassDomainRepository"), {
            toEntity: (json: any): ProxyBypassDomainEntity => {
                return ProxyBypassDomainFactory.fromJSON(json);
            },
            toJSON: (entity: ProxyBypassDomainEntity): any => {
                return entity.json;
            },
        });
    }
}
