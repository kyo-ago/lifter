import { ProxyCommandGrantStatus } from "@lifter/lifter-common";
import { NetworksetupProxy } from "@lifter/networksetup-proxy";
import { NetworksetupProxyGranted } from "./vaue-objects/networksetup-proxy-granted";

export class NetworksetupProxyEntity {
    constructor(
        private networksetupProxy: NetworksetupProxy,
        private networksetupProxyGranted: NetworksetupProxyGranted,
    ) {}

    async toggleGranted(): Promise<ProxyCommandGrantStatus> {
        this.networksetupProxyGranted = await this.networksetupProxyGranted.match({
            Grant: async () => {
                await this.networksetupProxy.removeGrant();
                return NetworksetupProxyGranted.getNotGranted();
            },
            notGrant: async () => {
                try {
                    await this.networksetupProxy.grant();
                    return NetworksetupProxyGranted.getGranted();
                } catch (e) {
                    // user cancel
                    return NetworksetupProxyGranted.getNotGranted();
                }
            },
        });
        return this.networksetupProxyGranted.getStatus();
    }

    callGranted(granted: () => Promise<void>): Promise<void> {
        return this.networksetupProxyGranted.callGranted(granted);
    }

    getCurrentStatus(): ProxyCommandGrantStatus {
        return this.networksetupProxyGranted.getStatus();
    }

    getCurrentCommands(): string[] {
        return this.networksetupProxyGranted.match({
            Grant: () => this.networksetupProxy.getRemoveGrantCommands(),
            notGrant: () => [this.networksetupProxy.getGrantCommand()],
        });
    }

    onChangeStatus(callback: (proxyCommandGrantStatus: ProxyCommandGrantStatus) => void): void {
        this.networksetupProxy.watchGrantCommands((result: boolean) => {
            this.networksetupProxyGranted = new NetworksetupProxyGranted(result);
            callback(this.networksetupProxyGranted.getStatus());
        });
    }
}
