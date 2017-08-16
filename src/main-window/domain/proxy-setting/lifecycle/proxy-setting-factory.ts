import {ProxySettingDeviceIdentity} from "../proxy-setting-device/proxy-setting-device-identity";
import {ProxySettingEntity} from "../proxy-setting-entity";
import {ProxySettingIdentity} from "../proxy-setting-identity";

export class ProxySettingFactory {
    private identity = 0;

    create(
        proxySettingDeviceIds: ProxySettingDeviceIdentity[],
        hasGrant: boolean,
    ): ProxySettingEntity {
        return new ProxySettingEntity(
            new ProxySettingIdentity(this.identity++),
            proxySettingDeviceIds,
            hasGrant,
        );
    }
}
