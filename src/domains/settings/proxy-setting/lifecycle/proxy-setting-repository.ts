import {OnMemoryRepository} from 'typescript-dddbase';
import {networksetupProxy} from '../../lib/networksetup-proxy-command';
import {NetworkInterfaceRepository} from '../../network-interface/lifecycle/network-interface-repository';
import {ProxySettingEntity} from '../proxy-setting-entity';
import {ProxySettingIdentity} from '../proxy-setting-identity';
import {ProxySettingFactory} from './proxy-setting-factory';

export class ProxySettingRepository extends OnMemoryRepository<ProxySettingIdentity, ProxySettingEntity> {
    private proxySettingEntity: ProxySettingEntity;

    constructor(
        private proxySettingFactory: ProxySettingFactory,
        private networkInterfaceRepository: NetworkInterfaceRepository,
    ) {
        super();
    }

    async loadEntities() {
        let hasGrant = await networksetupProxy.hasGrant();
        this.proxySettingEntity = this.proxySettingFactory.create(this.networkInterfaceRepository, hasGrant);
        this.store(this.proxySettingEntity);
    }

    getProxySetting(): ProxySettingEntity {
        return this.proxySettingEntity;
    }
}
