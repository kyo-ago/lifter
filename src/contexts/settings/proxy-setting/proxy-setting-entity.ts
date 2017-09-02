import {BaseEntity} from "../../share/domain/base/base-entity";
import {ProxySettingStatus} from "../../../windows/main/application/proxy-setting/proxy-setting-service";
import {networksetupProxy} from "../../../windows/main/libs/networksetup-proxy-command";
import {throwableCommand} from "../../../windows/main/libs/throwable-command";
import {ProxySettingDeviceRepository} from "./proxy-setting-device/lifecycle/proxy-setting-device-repository";
import {ProxySettingIdentity} from "./proxy-setting-identity";

export class ProxySettingEntity extends BaseEntity<ProxySettingIdentity> {
    constructor(
        identity: ProxySettingIdentity,
        private proxySettingDeviceRepository: ProxySettingDeviceRepository,
        public isGranted: boolean,
    ) {
        super(identity);
    }

    async getCurrentStatus(): Promise<ProxySettingStatus> {
        if (!this.isGranted) {
            return "NoPermission";
        }
        return (await this.isProxing()) ? "On" : "Off";
    }

    async getNewStatus(): Promise<ProxySettingStatus> {
        if (!this.isGranted) {
            await this.grantProxy();
            return (await this.isProxing()) ? "On" : "Off";
        }

        if (await this.isProxing()) {
            await this.disableProxy();
            return "Off";
        } else {
            await this.enableProxy();
            return "On";
        }
    }

    private async grantProxy() {
        await throwableCommand(networksetupProxy.grant());
        return true;
    }

    private async isProxing(): Promise<boolean> {
        let proxySettingDeviceEntities = await this.proxySettingDeviceRepository.resolveAllEnableDevices();
        let results = await Promise.all(proxySettingDeviceEntities.map((device) => device.proxing()));
        return results.find((result) => result);
    }

    private async enableProxy(): Promise<void[]> {
        let proxySettingDeviceEntities = await this.proxySettingDeviceRepository.resolveAllEnableDevices();
        return Promise.all(proxySettingDeviceEntities.map((device) => device.enableProxy()));
    }

    private async disableProxy(): Promise<void[]> {
        let proxySettingDeviceEntities = await this.proxySettingDeviceRepository.resolveAllEnableDevices();
        return Promise.all(proxySettingDeviceEntities.map((device) => device.disableProxy()));
    }
}