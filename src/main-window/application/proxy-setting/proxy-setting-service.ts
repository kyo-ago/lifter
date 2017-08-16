import {ProxySettingRepository} from "../../domain/proxy-setting/lifecycle/proxy-setting-repository";
import {ProxySettingEntity} from "../../domain/proxy-setting/proxy-setting-entity";

export type ProxySettingStatus = "NoPermission" | "On" | "Off";

export class ProxySettingService {
    constructor(
        private proxySettingRepository: ProxySettingRepository,
    ) {}

    async getCurrentStatus(): Promise<ProxySettingStatus> {
        let proxySettingEntity: ProxySettingEntity = await this.proxySettingRepository.getProxySetting();
        return proxySettingEntity.getCurrentStatus();
    }

    async getNewStatus(): Promise<ProxySettingStatus> {
        let proxySettingEntity: ProxySettingEntity = await this.proxySettingRepository.getProxySetting();
        return proxySettingEntity.getNewStatus();
    }
}