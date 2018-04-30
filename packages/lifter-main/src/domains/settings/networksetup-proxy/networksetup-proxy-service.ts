import { NetworksetupProxy } from "@lifter/networksetup-proxy";
import { NetworkInterfaceEntity } from "../network-interface/network-interface-entity";
import { NetworkInterfaceService } from "../network-interface/network-interface-service";
import { ProxyBypassDomainEntity } from "../proxy-bypass-domain/proxy-bypass-domain-entity";
import { ProxyCommandGrantService } from "../proxy-command-grant/proxy-command-grant-service";
import { NetworksetupProxyFactory } from "./lifecycle/networksetup-proxy-factory";

export class NetworksetupProxyService {
    private networksetupProxy: NetworksetupProxy;

    constructor(
        private networksetupProxyFactory: NetworksetupProxyFactory,
        private networkInterfaceService: NetworkInterfaceService,
        private proxyCommandGrantService: ProxyCommandGrantService,
    ) {}

    async load() {
        this.networksetupProxy = this.networksetupProxyFactory.getNetworksetupProxy();
    }

    enableProxy(): Promise<void> {
        return this.callAllInterface((ni) => ni.enableProxy(this.networksetupProxy));
    }

    disableProxy(): Promise<void> {
        return this.callAllInterface((ni) => ni.disableProxy(this.networksetupProxy));
    }

    clearAutoProxyUrl() {
        return this.callAllInterface((ni) => ni.clearAutoProxyUrl(this.networksetupProxy));
    }

    setAutoProxyUrl() {
        return this.callAllInterface((ni) => ni.setAutoProxyUrl(this.networksetupProxy));
    }

    reloadAutoProxyUrl() {
        return this.callAllInterface((ni) => ni.reloadAutoProxyUrl(this.networksetupProxy));
    }

    setProxyBypassDomains(proxyBypassDomainEntities: ProxyBypassDomainEntity[]) {
        return this.callAllInterface(async (ni) => {
            await ni.setProxyBypassDomains(this.networksetupProxy, proxyBypassDomainEntities);
        });
    }

    private async callAllInterface(
        callback: (networkInterfaceEntity: NetworkInterfaceEntity) => Promise<void>,
    ): Promise<void> {
        return this.proxyCommandGrantService.callGranted(async () => {
            let networkInterfaceEntities = await this.networkInterfaceService.fetchAllInterface();
            await Promise.all(networkInterfaceEntities.map(ni => callback(ni)));
        });
    }
}
