import * as ifconfig from "ifconfig";
import {OnMemoryRepository} from "typescript-dddbase";
import {getListnetworkserviceorder} from "../../../../libs/exec-command";
import {ProxySettingDeviceEntity} from "../proxy-setting-device-entity";
import {ProxySettingDeviceIdentity} from "../proxy-setting-device-identity";
import {ProxySettingDeviceFactory} from "./proxy-setting-device-factory";

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

function promisedIfconfig(): Promise<Ifconfig> {
    return new Promise((resolve, reject) => {
        ifconfig((err: any, configs: Ifconfig) => err ? reject(err) : resolve(configs));
    });
}

export class ProxySettingDeviceRepository extends OnMemoryRepository<ProxySettingDeviceIdentity, ProxySettingDeviceEntity> {
    constructor(
        private proxySettingDeviceFactory: ProxySettingDeviceFactory,
    ) {
        super();
    }

    async loadEntities() {
        let [serviceorder, ifconfig]: [string, Ifconfig] = await Promise.all([
            getListnetworkserviceorder(),
            promisedIfconfig(),
        ]);
        let entities = this.proxySettingDeviceFactory.creates(serviceorder, ifconfig);
        this.storeList(entities);
    }

    getAllId() {
        return Object.keys(this.entities)
            .sort((a,b) => Number(a) - Number(b))
            .map((key) => this.entities[key].id)
        ;
    }
}
