import {throwableCommand} from '../../../libs/throwable-command';
import {BaseEntity} from '../../share/base/base-entity';
import {networksetupProxy} from '../lib/networksetup-proxy-command';
import {NetworkInterfaceRepository} from '../network-interface/lifecycle/network-interface-repository';
import {ProxySettingIdentity} from './proxy-setting-identity';

export type ProxySettingStatus = "NoPermission" | "On" | "Off";

export class ProxySettingEntity extends BaseEntity<ProxySettingIdentity> {
    constructor(
        identity: ProxySettingIdentity,
        private networkInterfaceRepository: NetworkInterfaceRepository,
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

    async clearProxyState(): Promise<void> {
        await this.clearProxy();
        return;
    }

    private async grantProxy() {
        await throwableCommand(networksetupProxy.grant());
        return true;
    }

    private async isProxing(): Promise<boolean> {
        let networkInterfaceEntities = await this.networkInterfaceRepository.resolveAllEnableInterface();
        let results = await Promise.all(networkInterfaceEntities.map((device) => device.proxing()));
        return results.find((result) => result);
    }

    private async enableProxy(): Promise<void[]> {
        let networkInterfaceEntities = await this.networkInterfaceRepository.resolveAllEnableInterface();
        return Promise.all(networkInterfaceEntities.map((device) => device.enableProxy()));
    }

    private async disableProxy(): Promise<void[]> {
        let networkInterfaceEntities = await this.networkInterfaceRepository.resolveAllEnableInterface();
        return Promise.all(networkInterfaceEntities.map((device) => device.disableProxy()));
    }

    private async clearProxy(): Promise<void[]> {
        let networkInterfaceEntities = await this.networkInterfaceRepository.resolveAllEnableInterface();
        return Promise.all(networkInterfaceEntities.map((device) => device.clearProxy()));
    }
}