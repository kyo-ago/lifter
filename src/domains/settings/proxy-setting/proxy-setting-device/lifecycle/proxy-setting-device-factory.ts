import {ProxySettingDeviceEntity} from '../proxy-setting-device-entity';
import {ProxySettingDeviceIdentity} from '../proxy-setting-device-identity';
import {ProxySettingDeviceName} from '../value-objects/proxy-setting-device-name';
import {ProxySettingDeviceServiceName} from "../value-objects/proxy-setting-device-service-name";

export class ProxySettingDeviceFactory {
    private identity = 0;

    create(param: NetworkDeviceParam): ProxySettingDeviceEntity {
        return new ProxySettingDeviceEntity(
            new ProxySettingDeviceIdentity(this.identity++),
            new ProxySettingDeviceName(param.name),
            new ProxySettingDeviceServiceName(param.serviceName),
            param.enable,
        );
    }
}
