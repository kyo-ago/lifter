import {OnMemoryRepository} from "typescript-dddbase";
import {ProxySettingIdentity} from "./proxy-setting-identity";
import {ProxySettingEntity} from "./proxy-setting-entity";
import {ProxySettingFactory} from "./proxy-setting-factory";
import {execNetworkCommand, IOResult} from "../../libs/exec-command";
import {PROXY_SETTING_COMMAND} from "../settings";

import {Stats} from "fs";
const fs = require('fs');
const ifconfig = require('ifconfig');

export interface Ifconfig {
    [name: string]: {
        flags: string;
        ether?: string;
        options?: string;
        media?: string;
        status?: "inactive" | "active";
        inet6?: string;
        inet?: string;
    }
}

export class ProxySettingRepository extends OnMemoryRepository<ProxySettingIdentity, ProxySettingEntity> {
    getProxySetting() {
        return Promise.all([
            execNetworkCommand([`-listnetworkserviceorder`]).then(({stdout, stderr}: IOResult) => {
                if (stderr) {
                   throw new Error(stderr);
                }
                return stdout;
            }),
            new Promise((resolve, reject) => {
                ifconfig(function(err: any, configs: Ifconfig) {
                    if (err) {
                        return reject(err);
                    }
                    resolve(configs);
                });
            }),
            new Promise((resolve, reject) => {
                fs.stat(PROXY_SETTING_COMMAND, (err: any, stats: Stats) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(stats);
                });
            }),
        ]).then(([serviceorder, ifconfig, stats]: [string, Ifconfig, Stats]) => {
            return ProxySettingFactory.create(serviceorder, ifconfig, stats);
        });
    }
}
