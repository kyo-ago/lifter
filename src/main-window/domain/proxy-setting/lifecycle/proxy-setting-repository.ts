import * as ifconfig from "ifconfig";
import {OnMemoryRepository} from "typescript-dddbase";
import {getListnetworkserviceorder} from "../../../libs/exec-command";
import {networksetupProxy} from "../../../libs/networksetup-proxy-command";
import {ProxySettingEntity} from "../proxy-setting-entity";
import {ProxySettingIdentity} from "../proxy-setting-identity";
import {ProxySettingFactory} from "./proxy-setting-factory";

function promisedIfconfig(): Promise<Ifconfig> {
    return new Promise((resolve, reject) => {
        ifconfig((err: any, configs: Ifconfig) => err ? reject(err) : resolve(configs));
    });
}

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
    constructor(private proxySettingFactory: ProxySettingFactory) {
        super();
    }

    async getProxySetting(): Promise<ProxySettingEntity> {
        let [serviceorder, ifconfig, hasGrant]: [string, Ifconfig, boolean] = Promise.all([
            getListnetworkserviceorder(),
            promisedIfconfig(),
            networksetupProxy.hasGrant(),
        ]);

        return this.proxySettingFactory.create(serviceorder, ifconfig, hasGrant);
    }
}
