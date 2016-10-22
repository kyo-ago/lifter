import {OnMemoryRepository} from "typescript-dddbase";
import {ProxySettingIdentity} from "./proxy-setting-identity";
import {ProxySettingEntity} from "./proxy-setting-entity";
import {ProxySettingFactory} from "./proxy-setting-factory";
import {execNetworkCommand, IOResult} from "../../libs/execCommand";
import {PROXY_SETTING_COMMAND} from "../settings";

import {Stats} from "fs";
const fs = require('fs');

export class ProxySettingRepository extends OnMemoryRepository<ProxySettingIdentity, ProxySettingEntity> {
    getProxySetting() {
        return Promise.all([
            execNetworkCommand([`-listallnetworkservices`]).then(({stdout, stderr}: IOResult) => {
                if (stderr) {
                    throw new Error(stderr);
                }
                return stdout;
            }),
            new Promise((resolve, reject) => {
                fs.stat(PROXY_SETTING_COMMAND, (err: any, stats: Stats) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(stats);
                });
            }),
        ]).then((results: any[]) => {
            return ProxySettingFactory.create(results[0], results[1]);
        });
    }
}
