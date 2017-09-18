import {ProxySettingDeviceEntity} from '../proxy-setting-device-entity';
import {ProxySettingDeviceIdentity} from '../proxy-setting-device-identity';
import {ProxySettingDeviceHardwarePort} from '../value-objects/proxy-setting-device-hardware-port';
import {ProxySettingDeviceName} from '../value-objects/proxy-setting-device-name';

export class ProxySettingDeviceFactory {
    private identity = 0;

    create(param: NetworkDeviceParam): ProxySettingDeviceEntity {
        return new ProxySettingDeviceEntity(
            new ProxySettingDeviceIdentity(this.identity++),
            new ProxySettingDeviceName(param.name),
            new ProxySettingDeviceHardwarePort(param.hardwarePort),
            param.enable,
        );
    }
}
