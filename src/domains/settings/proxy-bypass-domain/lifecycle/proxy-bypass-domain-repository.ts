import * as Datastore from 'nedb';
import {getProxyByPassDomains} from "../../../../libs/exec-commands";
import {AsyncOnNedbRepository} from "../../../proxy/base/async-on-nedb-repository";
import {ShareProxyBypassDomainIdentity} from '../../../share/share-proxy-bypass-domain/share-proxy-bypass-domain-identity';
import {networksetupProxy} from "../../lib/networksetup-proxy-command";
import {ProxyBypassDomainEntity} from '../proxy-bypass-domain-entity';
import {ProxyBypassDomainFactory} from "./proxy-bypass-domain-factory";
import {NetworkInterfaceRepository} from "../../network-interface/lifecycle/network-interface-repository";

export class ProxyBypassDomainRepository extends AsyncOnNedbRepository<ShareProxyBypassDomainIdentity, ProxyBypassDomainEntity> {
    constructor(
        private networkInterfaceRepository: NetworkInterfaceRepository,
        datastore: Datastore
    ) {
        super(datastore, {
            toEntity: (json: any): ProxyBypassDomainEntity => {
                return ProxyBypassDomainFactory.fromJSON(json);
            },
            toJSON: (entity: ProxyBypassDomainEntity): any => {
                return entity.json;
            }
        });
    }

    async load() {
        await super.load();
        this.networkInterfaceRepository.resolveAllEnableInterface()
        getProxyByPassDomains
        networksetupProxy
    }
}
