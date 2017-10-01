import * as Datastore from 'nedb';
import {REPOSITORY_BASE_DIR_PATH} from "../../../../settings";
import {ShareProxyBypassDomainIdentity} from '../../../share/share-proxy-bypass-domain/share-proxy-bypass-domain-identity';
import {AsyncOnNedbRepository} from "../../base/async-on-nedb-repository";
import {ProxyBypassDomainEntity} from '../proxy-bypass-domain-entity';
import {ProxyBypassDomainFactory} from "./proxy-bypass-domain-factory";

export class ProxyBypassDomainRepository extends AsyncOnNedbRepository<ShareProxyBypassDomainIdentity, ProxyBypassDomainEntity> {
    constructor() {
        super(new Datastore({
            filename: `${REPOSITORY_BASE_DIR_PATH}/ProxyBypassDomainRepository.nedb`,
        }), {
            toEntity: (json: any): ProxyBypassDomainEntity => {
                return ProxyBypassDomainFactory.fromJSON(json);
            },
            toJSON: (entity: ProxyBypassDomainEntity): any => {
                return entity.json;
            }
        });
    }
}
