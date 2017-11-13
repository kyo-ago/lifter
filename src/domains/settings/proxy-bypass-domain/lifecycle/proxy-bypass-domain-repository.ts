import {AsyncOnNedbRepository} from "../../../proxy/base/async-on-nedb-repository";
import {ProjectEntity} from "../../../proxy/project/project-entity";
import {ShareProxyBypassDomainIdentity} from '../../../share/share-proxy-bypass-domain/share-proxy-bypass-domain-identity';
import {ProxyBypassDomainEntity} from '../proxy-bypass-domain-entity';
import {ProxyBypassDomainFactory} from "./proxy-bypass-domain-factory";

export class ProxyBypassDomainRepository extends AsyncOnNedbRepository<ShareProxyBypassDomainIdentity, ProxyBypassDomainEntity> {
    constructor(projectEntity: ProjectEntity) {
        super(
            projectEntity.getDataStoreOptions("proxyBypassDomainRepository"),
            {
                toEntity: (json: any): ProxyBypassDomainEntity => {
                    return ProxyBypassDomainFactory.fromJSON(json);
                },
                toJSON: (entity: ProxyBypassDomainEntity): any => {
                    return entity.json;
                }
            }
        );
    }
}
