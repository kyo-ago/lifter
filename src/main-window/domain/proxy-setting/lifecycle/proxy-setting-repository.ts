import {OnMemoryRepository} from "typescript-dddbase";
import {networksetupProxy} from "../../../libs/networksetup-proxy-command";
import {ProxySettingDeviceRepository} from "../proxy-setting-device/lifecycle/proxy-setting-device-repository";
import {ProxySettingEntity} from "../proxy-setting-entity";
import {ProxySettingIdentity} from "../proxy-setting-identity";
import {ProxySettingFactory} from "./proxy-setting-factory";

export class ProxySettingRepository extends OnMemoryRepository<ProxySettingIdentity, ProxySettingEntity> {
    constructor(
        private proxySettingFactory: ProxySettingFactory,
        private proxySettingDeviceRepository: ProxySettingDeviceRepository,
    ) {
        super();
    }

    async loadEntities() {
        await this.proxySettingDeviceRepository.loadEntities();
        let hasGrant = await networksetupProxy.hasGrant();
        let proxySettingDeviceIds = this.proxySettingDeviceRepository.getAllId();
        return this.proxySettingFactory.create(proxySettingDeviceIds, hasGrant);
    }

    async getProxySetting(): Promise<ProxySettingEntity> {
        
    }
}
