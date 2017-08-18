import {OnMemoryRepository} from "typescript-dddbase";
import {ExecCommand} from "../../../../libs/exec-command";
import {NetworkDeviceParam, ParseNetworkDevices} from "../../specs/parse-network-devices";
import {ProxySettingDeviceEntity} from "../proxy-setting-device-entity";
import {ProxySettingDeviceIdentity} from "../proxy-setting-device-identity";
import {ProxySettingDeviceFactory} from "./proxy-setting-device-factory";
const ifconfig = require("ifconfig");

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
    return new Promise((resolve, reject) => ifconfig((err: any, configs: Ifconfig) => err ? reject(err) : resolve(configs)));
}

export class ProxySettingDeviceRepository extends OnMemoryRepository<ProxySettingDeviceIdentity, ProxySettingDeviceEntity> {
    constructor(
        private proxySettingDeviceFactory: ProxySettingDeviceFactory,
    ) {
        super();
    }

    async resolveAllEnableDevices(): Promise<ProxySettingDeviceEntity[]> {
        let [serviceorder, ifconfig] = await Promise.all([
            ExecCommand.getListnetworkserviceorder(),
            promisedIfconfig(),
        ]);
        return ParseNetworkDevices(serviceorder, ifconfig)
            .map((param: NetworkDeviceParam) => this.proxySettingDeviceFactory.create(param))
            .filter((entity) => entity.enabled)
        ;
    }
}
