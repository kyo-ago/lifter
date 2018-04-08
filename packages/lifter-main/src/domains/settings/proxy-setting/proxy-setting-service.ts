import { ProxySettingStatus } from "@lifter/lifter-common";
import { NetworkInterfaceRepository } from "../network-interface/lifecycle/network-interface-repository";
import { NetworksetupProxyService } from "../networksetup-proxy-service/networksetup-proxy-service";

export interface getProxySettingService {
    fetch: () => Promise<ProxySettingStatus>;
    change: () => Promise<ProxySettingStatus>;
}

export class ProxySettingService {
    constructor(
        private networksetupProxyService: NetworksetupProxyService,
        private networkInterfaceRepository: NetworkInterfaceRepository,
    ) {}

    getProxySettingService(): getProxySettingService {
        return {
            fetch: (): Promise<ProxySettingStatus> => {
                return this.getCurrentStatus();
            },
            change: (): Promise<ProxySettingStatus> => {
                return this.getNewStatus();
            },
        };
    }

    async clearProxyState(): Promise<void> {
        return await this.networksetupProxyService.disableProxy();
    }

    private async getCurrentStatus(): Promise<ProxySettingStatus> {
        let isProxing = await this.isProxing();
        return isProxing ? "On" : "Off";
    }

    private async getNewStatus(): Promise<ProxySettingStatus> {
        let isProxing = await this.isProxing();
        if (isProxing) {
            await this.networksetupProxyService.disableProxy();
            return "Off";
        } else {
            await this.networksetupProxyService.enableProxy();
            return "On";
        }
    }

    private async isProxing(): Promise<boolean> {
        let networkInterfaceEntities = await this.networkInterfaceRepository.resolveAllInterface();
        let results = await Promise.all(networkInterfaceEntities.map(ni => ni.isProxing()));
        return results.find(result => result) || false;
    }
}
