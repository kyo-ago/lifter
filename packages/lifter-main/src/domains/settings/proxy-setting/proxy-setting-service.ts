import { ProxySettingStatus } from "@lifter/lifter-common";
import { NetworkInterfaceRepository } from "../network-interface/lifecycle/network-interface-repository";
import { NetworksetupProxyService } from "../networksetup-proxy-service/networksetup-proxy-service";

export class ProxySettingService {
    constructor(
        private networksetupProxyService: NetworksetupProxyService,
        private networkInterfaceRepository: NetworkInterfaceRepository,
    ) {}

    async getCurrentStatus(): Promise<ProxySettingStatus> {
        let isProxing = await this.isProxing();
        return isProxing ? "On" : "Off";
    }

    async getNewStatus(): Promise<ProxySettingStatus> {
        let isProxing = await this.isProxing();
        if (isProxing) {
            await this.networksetupProxyService.disableProxy();
            return "Off";
        } else {
            await this.networksetupProxyService.enableProxy();
            return "On";
        }
    }

    async clearProxyState(): Promise<void> {
        if (!this.networksetupProxyService.hasGrant()) {
            return;
        }
        return await this.networksetupProxyService.disableProxy();
    }

    private async isProxing(): Promise<boolean> {
        let networkInterfaceEntities = await this.networkInterfaceRepository.resolveAllInterface();
        let results = await Promise.all(networkInterfaceEntities.map(ni => ni.isProxing()));
        return results.find(result => result);
    }
}
