import { NetworkInterfaceRepository } from "../network-interface/lifecycle/network-interface-repository";
import { NetworksetupProxyService } from "../networksetup-proxy-service/networksetup-proxy-service";
import { ProxyBypassDomainRepository } from "./lifecycle/proxy-bypass-domain-repository";
import { ProxyBypassDomainEntity } from "./proxy-bypass-domain-entity";

export class ProxyBypassDomainService {
    constructor(
        private proxyBypassDomainRepository: ProxyBypassDomainRepository,
        private networksetupProxyService: NetworksetupProxyService,
        private networkInterfaceRepository: NetworkInterfaceRepository
    ) {}

    load() {
        return this.setProxyBypassDomains();
    }

    resolveAll() {
        return this.proxyBypassDomainRepository.resolveAll();
    }

    async overwriteAll(proxyBypassDomainEntities: ProxyBypassDomainEntity[]) {
        await this.proxyBypassDomainRepository.overwriteAll(proxyBypassDomainEntities);
        return await this.setProxyBypassDomains();
    }

    private async setProxyBypassDomains() {
        let networksetupProxy = this.networksetupProxyService.getNetworksetupProxy();
        if (!networksetupProxy) {
            return;
        }
        let proxyBypassDomainEntities = await this.proxyBypassDomainRepository.resolveAll();
        let allInterfaces = await this.networkInterfaceRepository.resolveAllInterface();
        let promises = allInterfaces.map(ni => ni.setProxyBypassDomains(networksetupProxy, proxyBypassDomainEntities));
        return await Promise.all(promises);
    }
}
