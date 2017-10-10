import {NetworkInterfaceRepository} from '../../network-interface/lifecycle/network-interface-repository';
import {ProxySettingEntity} from '../proxy-setting-entity';
import {ProxySettingIdentity} from '../proxy-setting-identity';

export class ProxySettingFactory {
    private identity = 0;

    create(
        networkInterfaceRepository: NetworkInterfaceRepository,
        hasGrant: boolean,
    ): ProxySettingEntity {
        return new ProxySettingEntity(
            new ProxySettingIdentity(this.identity++),
            networkInterfaceRepository,
            hasGrant,
        );
    }
}
