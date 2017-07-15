import {ProxySettingEntity} from "./proxy-setting-entity";
import {ProxySettingIdentity} from "./proxy-setting-identity";
import {ProxySettingDevices} from "./value-objects/proxy-setting-devices";

import {Stats} from "fs";
import {Ifconfig} from "./proxy-setting-repository";

interface Device {
    "Hardware Port": string
    "Device": string
}

export class ProxySettingFactory {
    private static identity = 0;

    static create(
        serviceorder: string,
        ifconfig: Ifconfig,
        hasGrant: boolean,
    ): ProxySettingEntity {
        let deviceOrder = serviceorder.trim().match(/\(Hardware Port.+?\)/gi).map((line) => {
            return line.replace(/[\(\)]/g, '').split(/,/).reduce((base: any, cur: string) => {
                let [key, val] = cur.split(/:/);
                base[key.trim()] = val.trim();
                return base;
            }, <Device>{});
        });
        let devices = deviceOrder.filter((device) => {
            let conf = ifconfig[device.Device];
            return conf && conf.status == 'active' && 'ether' in conf;
        }).map(device => device['Hardware Port']);

        return new ProxySettingEntity(
            new ProxySettingIdentity(this.identity++),
            new ProxySettingDevices(devices),
            hasGrant,
        );
    }
}