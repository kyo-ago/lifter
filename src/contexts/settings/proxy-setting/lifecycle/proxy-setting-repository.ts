import {OnMemoryRepository} from "typescript-dddbase";
import {networksetupProxy} from "../../../../windows/main/libs/networksetup-proxy-command";
import {ProxySettingDeviceRepository} from "../proxy-setting-device/lifecycle/proxy-setting-device-repository";
import {ProxySettingEntity} from "../proxy-setting-entity";
import {ProxySettingIdentity} from "../proxy-setting-identity";
import {ProxySettingFactory} from "./proxy-setting-factory";

export class ProxySettingRepository extends OnMemoryRepository<ProxySettingIdentity, ProxySettingEntity> {
    private proxySettingEntity: ProxySettingEntity;

    constructor(
        private proxySettingFactory: ProxySettingFactory,
        private proxySettingDeviceRepository: ProxySettingDeviceRepository,
    ) {
        super();
    }

    async loadEntities() {
        let hasGrant = await networksetupProxy.hasGrant();
        this.proxySettingEntity = this.proxySettingFactory.create(this.proxySettingDeviceRepository, hasGrant);
        this.store(this.proxySettingEntity);
    }

    getProxySetting(): ProxySettingEntity {
        return this.proxySettingEntity;
    }
}
