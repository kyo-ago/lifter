import {ProxySettingEntity} from "./proxy-setting-entity";
import {ProxySettingIdentity} from "./proxy-setting-identity";
import {ProxySettingDevices} from "./proxy-setting-devices";

import {Stats} from "fs";

export class ProxySettingFactory {
    private static identity = 0;

    static create(device: string, stats: Stats): ProxySettingEntity {
        let devices = device.split(/\r?\n/).filter(_ => _);
        // Ignore "An asterisk (*) denotes that a network service is disabled." line
        devices.shift();

        return new ProxySettingEntity(
            new ProxySettingIdentity(this.identity++),
            new ProxySettingDevices(devices),
            stats.uid === 0,
        );
    }
}