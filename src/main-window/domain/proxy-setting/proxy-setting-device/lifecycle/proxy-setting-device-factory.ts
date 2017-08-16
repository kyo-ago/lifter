import {ParseNetworkDevices} from "../../specs/parse-network-devices";
import {ProxySettingDeviceEntity} from "../proxy-setting-device-entity";
import {ProxySettingDeviceIdentity} from "../proxy-setting-device-identity";
import {ProxySettingDeviceHardwarePort} from "../value-objects/proxy-setting-device-hardware-port";
import {ProxySettingDeviceName} from "../value-objects/proxy-setting-device-name";
import {Ifconfig} from "./proxy-setting-device-repository";

export class ProxySettingDeviceFactory {
    private identity = 0;

    creates(
        serviceorder: string,
        ifconfig: Ifconfig,
    ): ProxySettingDeviceEntity[] {
        return ParseNetworkDevices(serviceorder, ifconfig).map((param) => {
            return new ProxySettingDeviceEntity(
                new ProxySettingDeviceIdentity(this.identity++),
                new ProxySettingDeviceName(param.name),
                new ProxySettingDeviceHardwarePort(param.hardwarePort),
                param.enable,
            );
        });
    }
}