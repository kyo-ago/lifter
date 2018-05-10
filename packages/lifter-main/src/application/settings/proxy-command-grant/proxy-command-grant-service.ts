import { ProxyCommandGrantStatus } from "@lifter/lifter-common";
import { NetworksetupProxy } from "@lifter/networksetup-proxy";
import { injectable } from "inversify";
import * as Rx from "rxjs/Rx";
import { NetworksetupProxyFactory } from "../networksetup-proxy/lifecycle/networksetup-proxy-factory";
import { ProxyCommandGrantSetting } from "./vaue-objects/proxy-command-grant-setting";

export interface getProxyCommandGrantService {
    onChange: (
        callback: (proxyCommandGrantStatus: ProxyCommandGrantStatus) => void,
    ) => void;
    fetchStatus: () => Promise<ProxyCommandGrantStatus>;
    fetchCommands: () => Promise<string[]>;
    changeStatus: () => Promise<ProxyCommandGrantStatus>;
}

@injectable()
export class ProxyCommandGrantService {
    private observable: Rx.Subject<ProxyCommandGrantStatus> = new Rx.Subject();
    private proxyCommandGrantSetting: ProxyCommandGrantSetting;
    private networksetupProxy: NetworksetupProxy;

    constructor(private networksetupProxyFactory: NetworksetupProxyFactory) {}

    async load() {
        this.networksetupProxy = this.networksetupProxyFactory.getNetworksetupProxy();
        let hasGrant = await this.networksetupProxy.hasGrant();
        this.proxyCommandGrantSetting = new ProxyCommandGrantSetting(hasGrant);
        this.networksetupProxy.watchGrantCommands(async (result: boolean) => {
            this.proxyCommandGrantSetting = new ProxyCommandGrantSetting(
                result,
            );
            this.observable.next(this.proxyCommandGrantSetting.getStatus());
        });
    }

    getProxyCommandGrantService(): getProxyCommandGrantService {
        return {
            onChange: (
                callback: (
                    proxyCommandGrantStatus: ProxyCommandGrantStatus,
                ) => void,
            ): void => {
                this.onChangeStatus(callback);
            },
            fetchStatus: async (): Promise<ProxyCommandGrantStatus> => {
                return this.getCurrentStatus();
            },
            fetchCommands: async (): Promise<string[]> => {
                return this.getCurrentCommands();
            },
            changeStatus: async (): Promise<ProxyCommandGrantStatus> => {
                return await this.toggleGranted();
            },
        };
    }

    async toggleGranted(): Promise<ProxyCommandGrantStatus> {
        this.proxyCommandGrantSetting = await this.proxyCommandGrantSetting.match(
            {
                Grant: async () => {
                    await this.networksetupProxy.removeGrant();
                    return ProxyCommandGrantSetting.getNotGranted();
                },
                notGrant: async () => {
                    try {
                        await this.networksetupProxy.grant();
                        return ProxyCommandGrantSetting.getGranted();
                    } catch (e) {
                        // user cancel
                        return ProxyCommandGrantSetting.getNotGranted();
                    }
                },
            },
        );
        return this.proxyCommandGrantSetting.getStatus();
    }

    callGranted(granted: () => Promise<void>): Promise<void> {
        return this.proxyCommandGrantSetting.callGranted(granted);
    }

    getCurrentStatus(): ProxyCommandGrantStatus {
        return this.proxyCommandGrantSetting.getStatus();
    }

    getCurrentCommands(): string[] {
        return this.proxyCommandGrantSetting.match({
            Grant: () => this.networksetupProxy.getRemoveGrantCommands(),
            notGrant: () => [this.networksetupProxy.getGrantCommand()],
        });
    }

    onChangeStatus(
        callback: (proxyCommandGrantStatus: ProxyCommandGrantStatus) => void,
    ): void {
        this.observable.subscribe(callback);
    }
}
