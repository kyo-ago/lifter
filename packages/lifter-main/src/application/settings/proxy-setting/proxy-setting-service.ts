import * as Watch from "@lifter/file-watcher";
import { ProxySettingStatus } from "@lifter/lifter-common";
import { injectable } from "inversify";
import { PROXY_PREFERENCES_PLIST_PATH } from "../../../settings";
import { NetworkInterfaceService } from "../network-interface/network-interface-service";
import { NetworksetupProxyService } from "../networksetup-proxy/networksetup-proxy-service";
import { PacFileService } from "../pac-file/pac-file-service";
import { UserSettingsService } from "../user-settings/user-settings-service";

export interface getProxySettingService {
    fetch: () => Promise<ProxySettingStatus>;
    change: () => Promise<ProxySettingStatus>;
    onChange: (
        callback: (proxySettingStatus: ProxySettingStatus) => void,
    ) => void;
}

@injectable()
export class ProxySettingService {
    constructor(
        private userSettingsService: UserSettingsService,
        private pacFileService: PacFileService,
        private networksetupProxyService: NetworksetupProxyService,
        private networkInterfaceService: NetworkInterfaceService,
    ) {}

    load() {
        this.userSettingsService.onChangeNoPacFileProxy((_: boolean) => {
            // ignore return value
            void this.changeProxyType();
        });
    }

    getProxySettingService(): getProxySettingService {
        return {
            fetch: (): Promise<ProxySettingStatus> => {
                return this.getCurrentStatus();
            },
            change: (): Promise<ProxySettingStatus> => {
                return this.getNewStatus();
            },
            onChange: (
                callback: (proxySettingStatus: ProxySettingStatus) => void,
            ): void => {
                this.onChange(callback);
            },
        };
    }

    async startup(): Promise<void> {
        await this.enable();
    }

    async shutdown(): Promise<void> {
        await this.disable();
    }

    private async getCurrentStatus(): Promise<ProxySettingStatus> {
        return await this.getStatus();
    }

    private async getNewStatus(): Promise<ProxySettingStatus> {
        return await this.getMatchStatus({
            NoTargetInterfaces: (): Promise<ProxySettingStatus> =>
                Promise.resolve(<ProxySettingStatus>"NoTargetInterfaces"),
            On: async (): Promise<ProxySettingStatus> => {
                await this.disable();
                return "Off";
            },
            Off: async (): Promise<ProxySettingStatus> => {
                await this.enable();
                return "On";
            },
        });
    }

    private onChange(callback: (proxySettingStatus: ProxySettingStatus) => void) {
        return Watch(PROXY_PREFERENCES_PLIST_PATH, async () =>
            callback(await this.getCurrentStatus()),
        );
    }

    private async changeProxyType() {
        await this.getMatchStatus({
            NoTargetInterfaces: (): Promise<void> => Promise.resolve(),
            Off: async (): Promise<void> => Promise.resolve(),
            On: async (): Promise<void> => {
                await this.userSettingsService.isPacFileProxy({
                    Some: () => this.networksetupProxyService.disableProxy(),
                    None: () => this.pacFileService.stop(),
                });
                await this.enable();
            },
        });
    }

    private async getMatchStatus<R>(
        matcher: { [key in ProxySettingStatus]: () => R },
    ): Promise<R> {
        let status = await this.getStatus();
        return matcher[status]();
    }

    private async getStatus(): Promise<ProxySettingStatus> {
        let networkInterfaceEntities = await this.networkInterfaceService.fetchAllInterface();
        if (!networkInterfaceEntities.length) {
            return "NoTargetInterfaces";
        }
        let results = await Promise.all(
            networkInterfaceEntities.map(ni => ni.isProxing()),
        );
        let result = results.find(result => result) || false;
        return result ? "On" : "Off";
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
