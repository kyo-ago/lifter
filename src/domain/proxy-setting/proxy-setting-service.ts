import {ProxySettingRepository} from "./proxy-setting-repository";
import {ProxySettingEntity} from "./proxy-setting-entity";

export type ProxySettingStatus = "NoPermission" | "On" | "Off";

export class ProxySettingService {
    private proxySettingRepository = new ProxySettingRepository();

    initialize() {
        return this.proxySettingRepository.getProxySetting().then((proxySettingEntity: ProxySettingEntity) => {
            return proxySettingEntity.getCurrentStatus();
        });
    }

    click() {
        return this.proxySettingRepository.getProxySetting().then((proxySettingEntity: ProxySettingEntity) => {
            return proxySettingEntity.getNewStatus();
        });
    }

}