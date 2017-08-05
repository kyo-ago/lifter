import {ProxySettingRepository} from "../../domain/proxy-setting/lifecycle/proxy-setting-repository";
import {ProxySettingEntity} from "../../domain/proxy-setting/proxy-setting-entity";

export type ProxySettingStatus = "NoPermission" | "On" | "Off";

export class ProxySettingService {
    constructor(
        private proxySettingRepository: ProxySettingRepository,
    ) { }

    getCurrentStatus() {
        return this.proxySettingRepository.getProxySetting().then((proxySettingEntity: ProxySettingEntity) => {
            return proxySettingEntity.getCurrentStatus();
        });
    }

    getNewStatus(): Promise<ProxySettingStatus> {
        return this.proxySettingRepository.getProxySetting().then((proxySettingEntity: ProxySettingEntity) => {
            return proxySettingEntity.getNewStatus();
        });
    }
}