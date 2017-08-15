import {ProxySettingEntity} from "../proxy-setting-entity";
import {ProxySettingIdentity} from "../proxy-setting-identity";
import {ParseNetworkDevices} from "../specs/parse-network-devices";
import {ProxySettingDevice} from "../value-objects/proxy-setting-device";
import {Ifconfig} from "./proxy-setting-repository";

export class ProxySettingFactory {
    private identity = 0;

    create(
        serviceorder: string,
        ifconfig: Ifconfig,
        hasGrant: boolean,
    ): ProxySettingEntity {
        let enableDevices = ParseNetworkDevices(serviceorder, ifconfig);
        return new ProxySettingEntity(
            new ProxySettingIdentity(this.identity++),
            enableDevices.map((device) => new ProxySettingDevice(device)),
            hasGrant,
        );
    }
}