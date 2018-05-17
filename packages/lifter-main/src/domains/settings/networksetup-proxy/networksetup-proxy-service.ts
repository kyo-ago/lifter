import { injectable } from "inversify";
import { NetworkInterfaceEntity } from "../network-interface/network-interface-entity";
import { NetworkInterfaceService } from "../network-interface/network-interface-service";
import { ProxyBypassDomainEntity } from "../proxy-bypass-domain/proxy-bypass-domain-entity";
import { NetworksetupProxyContainer } from "./networksetup-proxy-container";

@injectable()
export class NetworksetupProxyService {
    constructor(
        private networksetupProxyCommand: NetworksetupProxyContainer,
        private networkInterfaceService: NetworkInterfaceService,
    ) {}

    enableProxy(): Promise<void> {
        return this.callAllInterface(ni =>
            ni.enableProxy(this.networksetupProxyCommand.getCommand()),
        );
    }

    disableProxy(): Promise<void> {
        return this.callAllInterface(ni =>
            ni.disableProxy(this.networksetupProxyCommand.getCommand()),
        );
    }

    clearAutoProxyUrl() {
        return this.callAllInterface(ni =>
            ni.clearAutoProxyUrl(this.networksetupProxyCommand.getCommand()),
        );
    }

    setAutoProxyUrl() {
        return this.callAllInterface(ni =>
            ni.setAutoProxyUrl(this.networksetupProxyCommand.getCommand()),
        );
    }

    reloadAutoProxyUrl() {
        return this.callAllInterface(ni =>
            ni.reloadAutoProxyUrl(this.networksetupProxyCommand.getCommand()),
        );
    }

    setProxyBypassDomains(
        proxyBypassDomainEntities: ProxyBypassDomainEntity[],
    ) {
        return this.callAllInterface(async ni => {
            await ni.setProxyBypassDomains(
                this.networksetupProxyCommand.getCommand(),
                proxyBypassDomainEntities,
            );
        });
    }

    private async callAllInterface(
        callback: (
            networkInterfaceEntity: NetworkInterfaceEntity,
        ) => Promise<void>,
    ): Promise<void> {
        let networkInterfaceEntities = await this.networkInterfaceService.fetchAllInterface();
        await Promise.all(networkInterfaceEntities.map(ni => callback(ni)));
    }
}
