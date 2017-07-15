import {OnMemoryRepository} from "typescript-dddbase";
import {ProxySettingIdentity} from "./proxy-setting-identity";
import {ProxySettingEntity} from "./proxy-setting-entity";
import {ProxySettingFactory} from "./proxy-setting-factory";
import {execNetworkCommand, IOResult} from "../../libs/exec-command";
import {NETWORK_SETUP_PROXY_COMMAND} from "../settings";
const ifconfig = require('ifconfig');

import {NetworksetupProxy} from "networksetup-proxy";
let networksetupProxy = new NetworksetupProxy(NETWORK_SETUP_PROXY_COMMAND);

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
            networksetupProxy.hasGrant(),
        ]).then(([serviceorder, ifconfig, hasGrant]: [string, Ifconfig, any]) => {
            return ProxySettingFactory.create(serviceorder, ifconfig, hasGrant);
        });
    }
}
