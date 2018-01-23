import { ProxySettingStatus } from "@lifter/lifter-common";
import { UserSettingStorage } from "../../libs/user-setting-storage";
import { NetworkInterfaceRepository } from "../network-interface/lifecycle/network-interface-repository";
import { NetworksetupProxyService } from "../networksetup-proxy-service/networksetup-proxy-service";

export class ProxySettingService {
    constructor(
        private networksetupProxyService: NetworksetupProxyService,
        private networkInterfaceRepository: NetworkInterfaceRepository,
        private userSettingStorage: UserSettingStorage
    ) {}

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
            await Promise.all([
                this.networksetupProxyService.disableProxy(),
                this.userSettingStorage.store("noProxy", true)
            ]);
            return "Off";
        }
        await Promise.all([
            this.networksetupProxyService.enableProxy(),
            this.userSettingStorage.store("noProxy", false)
        ]);
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
        let results = await Promise.all(networkInterfaceEntities.map(ni => ni.isProxing()));
        return results.find(result => result);
    }

    private clearProxy(): Promise<void> {
        return this.networksetupProxyService.disableProxy();
    }
}
