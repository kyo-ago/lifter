import {BaseEntity} from "../../../../share/domain/base/base-entity";
import {ProxySettingDeviceIdentity} from "./proxy-setting-device-identity";
import {ProxySettingDeviceHardwarePort} from "./value-objects/proxy-setting-device-hardware-port";
import {ProxySettingDeviceName} from "./value-objects/proxy-setting-device-name";

export class ProxySettingDeviceEntity extends BaseEntity<ProxySettingDeviceIdentity> {
    constructor(
        identity: ProxySettingDeviceIdentity,
        private name: ProxySettingDeviceName,
        private hardwarePort: ProxySettingDeviceHardwarePort,
        private enable: boolean,
    ) {
        super(identity);
    }
}
