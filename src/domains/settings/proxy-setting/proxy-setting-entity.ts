import {throwableCommand} from '../../../libs/throwable-command';
import {BaseEntity} from '../../share/base/base-entity';
import {networksetupProxy} from './networksetup-proxy-command';
import {ProxySettingDeviceRepository} from './proxy-setting-device/lifecycle/proxy-setting-device-repository';
import {ProxySettingIdentity} from './proxy-setting-identity';

export type ProxySettingStatus = "NoPermission" | "On" | "Off";

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
            this.isGranted = true;
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

    clearProxyState(): Promise<void> {
        return this.clearProxy().then(() => undefined);
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

    private async clearProxy(): Promise<void[]> {
        let proxySettingDeviceEntities = await this.proxySettingDeviceRepository.resolveAllEnableDevices();
        return Promise.all(proxySettingDeviceEntities.map((device) => device.clearProxy()));
    }
}