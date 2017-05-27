import {ProxySettingRepository} from "../../domain/proxy-setting/proxy-setting-repository";
import {ProxySettingEntity} from "../../domain/proxy-setting/proxy-setting-entity";

export type ProxySettingStatus = "NoPermission" | "On" | "Off";

export class ProxySetting {
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