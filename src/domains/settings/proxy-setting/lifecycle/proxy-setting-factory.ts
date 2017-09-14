import {ProxySettingDeviceRepository} from '../proxy-setting-device/lifecycle/proxy-setting-device-repository';
import {ProxySettingEntity} from '../proxy-setting-entity';
import {ProxySettingIdentity} from '../proxy-setting-identity';

export class ProxySettingFactory {
    private identity = 0;

    create(
        proxySettingDeviceRepository: ProxySettingDeviceRepository,
        hasGrant: boolean,
    ): ProxySettingEntity {
        return new ProxySettingEntity(
            new ProxySettingIdentity(this.identity++),
            proxySettingDeviceRepository,
            hasGrant,
        );
    }
}
