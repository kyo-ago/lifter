import { injectable } from "inversify";
import { AsyncOnNedbRepository } from "../../../../domains/base/async-on-nedb-repository";
import { ProjectEntity } from "../../../../domains/proxy/project/project-entity";
import { ProxyBypassDomainEntity } from "../proxy-bypass-domain-entity";
import { ProxyBypassDomainIdentity } from "../proxy-bypass-domain-identity";
import { ProxyBypassDomainFactory } from "./proxy-bypass-domain-factory";

@injectable()
export class ProxyBypassDomainRepository extends AsyncOnNedbRepository<
    ProxyBypassDomainIdentity,
    ProxyBypassDomainEntity
> {
    constructor(projectEntity: ProjectEntity) {
        super(projectEntity.getDataStoreOptions(ProxyBypassDomainRepository.name), {
            toEntity: (json: any): ProxyBypassDomainEntity => {
                return ProxyBypassDomainFactory.fromJSON(json);
            },
            toJSON: (entity: ProxyBypassDomainEntity): any => {
                return entity.json;
            },
        });
    }
}
