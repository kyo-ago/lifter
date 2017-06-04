import {ProxySettingRepository} from "../../domain/proxy-setting/proxy-setting-repository";
import {ProxySettingEntity} from "../../domain/proxy-setting/proxy-setting-entity";

export type ProxySettingStatus = "NoPermission" | "On" | "Off";

export class ProxySettingService {
    private proxySettingRepository = new ProxySettingRepository();

    getCurrentStatus() {
        return this.proxySettingRepository.getProxySetting().then((proxySettingEntity: ProxySettingEntity) => {
            return proxySettingEntity.getCurrentStatus();
        });
    }

    getNewStatus() {
        return this.proxySettingRepository.getProxySetting().then((proxySettingEntity: ProxySettingEntity) => {
            return proxySettingEntity.getNewStatus();
        });
    }

}