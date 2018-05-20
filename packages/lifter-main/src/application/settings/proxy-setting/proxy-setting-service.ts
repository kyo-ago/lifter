import * as Watch from "@lifter/file-watcher";
import {
    PacFileProxyStatus,
    ProxyCommandGrantStatus,
    ProxySettingStatus,
} from "@lifter/lifter-common";
import { injectable } from "inversify";
import { NetworkInterfaceService } from "../../../domains/settings/network-interface/network-interface-service";
import { NetworksetupProxyService } from "../../../domains/settings/networksetup-proxy/networksetup-proxy-service";
import { PacFileService } from "../../../domains/settings/pac-file/pac-file-service";
import { ProxyCommandGrantService } from "../../../domains/settings/proxy-command-grant/proxy-command-grant-service";
import { UserSettingsService } from "../../../domains/settings/user-settings/user-settings-service";
import { PROXY_PREFERENCES_PLIST_PATH } from "../../../settings";

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
        private proxyCommandGrantService: ProxyCommandGrantService,
    ) {}

    load() {
        this.userSettingsService.onChangePacFileProxy(
            (_: PacFileProxyStatus) => {
                // ignore return value
                void this.changeProxyType();
            },
        );
        this.proxyCommandGrantService.onChangeStatus(
            (proxyCommandGrantStatus: ProxyCommandGrantStatus) => {
                if (proxyCommandGrantStatus === "On") {
                    void this.autoEnable();
                }
            },
        );
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
        await this.autoEnable();
    }

    async shutdown(): Promise<void> {
        await this.disable();
    }

    async autoEnable(): Promise<void> {
        await this.userSettingsService.isAutoEnableProxy({
            On: () => this.enable(),
            Off: () => Promise.resolve(),
        });
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

    private onChange(
        callback: (proxySettingStatus: ProxySettingStatus) => void,
    ) {
        return Watch(PROXY_PREFERENCES_PLIST_PATH, async () =>
            callback(await this.getCurrentStatus()),
        );
    }

    private async changeProxyType() {
        await this.getMatchStatus({
            NoTargetInterfaces: (): Promise<void> => Promise.resolve(),
            Off: async (): Promise<void> => Promise.resolve(),
            On: async (): Promise<void> => {
                await this.proxyCommandGrantService.callGranted(() => {
                    return this.userSettingsService.isPacFileProxy({
                        On: () => this.networksetupProxyService.disableProxy(),
                        Off: () => this.pacFileService.stop(),
                    });
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
        await this.proxyCommandGrantService.callGranted(() => {
            return this.userSettingsService.isPacFileProxy({
                On: () => this.pacFileService.start(),
                Off: () => this.networksetupProxyService.enableProxy(),
            });
        });
    }

    private async disable() {
        await this.proxyCommandGrantService.callGranted(() => {
            return this.userSettingsService.isPacFileProxy({
                On: () => this.pacFileService.stop(),
                Off: () => this.networksetupProxyService.disableProxy(),
            });
        });
    }
}
