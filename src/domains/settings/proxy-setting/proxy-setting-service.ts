import {NetworksetupProxyService} from '../networksetup-proxy-service/networksetup-proxy-service';
import {NetworkInterfaceRepository} from '../network-interface/lifecycle/network-interface-repository';

export type ProxySettingStatus = "NoPermission" | "On" | "Off";

export class ProxySettingService {
    constructor(
        private networksetupProxyService: NetworksetupProxyService,
        private networkInterfaceRepository: NetworkInterfaceRepository,
    ) {
    }

    async getCurrentStatus(): Promise<ProxySettingStatus> {
        if (!this.networksetupProxyService.isGranted) {
            return "NoPermission";
        }
        let isProxing = await this.isProxing();
        return isProxing ? "On" : "Off";
    }

    async getNewStatus(): Promise<ProxySettingStatus> {
        if (!this.networksetupProxyService.isGranted) {
            let result = await this.networksetupProxyService.grantProxyCommand();
            if (!result) {
                return "NoPermission";
            }
            return (await this.isProxing()) ? "On" : "Off";
        }

        let isProxing = await this.isProxing();
        if (isProxing) {
            await this.disableProxy();
            return "Off";
        }
        await this.enableProxy();
        return "On";
    }

    async clearProxyState(): Promise<void> {
        if (!this.networksetupProxyService.isGranted) {
            return;
        }
        await this.clearProxy();
        return;
    }

    private async isProxing(): Promise<boolean> {
        let networkInterfaceEntities = await this.networkInterfaceRepository.resolveAllInterface();
        let results = await Promise.all(networkInterfaceEntities.map((ni) => ni.isProxing()));
        return results.find((result) => result);
    }

    private async enableProxy(): Promise<void> {
        let networkInterfaceEntities = await this.networkInterfaceRepository.resolveAllInterface();
        return await this.networksetupProxyService.getNetworksetupProxy()
            .map((networksetupProxy) => Promise.all(networkInterfaceEntities.map((ni) => ni.enableProxy(networksetupProxy))))
            .getOrElse(() => Promise.resolve(undefined))
        ;
    }

    private async disableProxy(): Promise<void> {
        let networkInterfaceEntities = await this.networkInterfaceRepository.resolveAllInterface();
        return await this.networksetupProxyService.getNetworksetupProxy()
            .map((networksetupProxy) => Promise.all(networkInterfaceEntities.map((ni) => ni.disableProxy(networksetupProxy))))
            .getOrElse(() => Promise.resolve(undefined))
        ;
    }

    private clearProxy(): Promise<void> {
        return this.disableProxy();
    }
}
