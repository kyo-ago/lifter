import { ProxySettingStatus } from "@lifter/lifter-common";
import { PacFileService } from "../../proxy/pac-file/pac-file-service";
import { NetworkInterfaceRepository } from "../network-interface/lifecycle/network-interface-repository";
import { NetworksetupProxyService } from "../networksetup-proxy-service/networksetup-proxy-service";
import { UserSettingsService } from "../user-settings/user-settings-service";

export interface getProxySettingService {
    fetch: () => Promise<ProxySettingStatus>;
    change: () => Promise<ProxySettingStatus>;
}

export class ProxySettingService {
    constructor(
        private userSettingsService: UserSettingsService,
        private pacFileService: PacFileService,
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

    async startup(): Promise<void> {
        await this.enable();
    }

    async shutwodn(): Promise<void> {
        await this.disable();
    }

    private async getCurrentStatus(): Promise<ProxySettingStatus> {
        let isProxing = await this.isProxing();
        return isProxing ? "On" : "Off";
    }

    private async getNewStatus(): Promise<ProxySettingStatus> {
        let isProxing = await this.isProxing();
        if (isProxing) {
            await this.disable();
            return "Off";
        } else {
            await this.enable();
            return "On";
        }
    }

    private async isProxing(): Promise<boolean> {
        let networkInterfaceEntities = await this.networkInterfaceRepository.resolveAllInterface();
        let results = await Promise.all(networkInterfaceEntities.map(ni => ni.isProxing()));
        return results.find(result => result) || false;
    }

    private async enable(): Promise<void> {
        await this.userSettingsService.isPacFileProxy({
            Some: () => this.pacFileService.start(),
            None: () => this.networksetupProxyService.enableProxy(),
        });
    }

    private async disable() {
        await this.userSettingsService.isPacFileProxy({
            Some: () => this.pacFileService.stop(),
            None: () => this.networksetupProxyService.disableProxy(),
        });
    }
}
