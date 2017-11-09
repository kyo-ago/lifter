import {NetworksetupProxyService} from "../networksetup-proxy-service/networksetup-proxy-service";
import {NetworkInterfaceRepository} from "../network-interface/lifecycle/network-interface-repository";
import {ProxyBypassDomainRepository} from "./lifecycle/proxy-bypass-domain-repository";
import {ProxyBypassDomainEntity} from "./proxy-bypass-domain-entity";

export class ProxyBypassDomainService {
    constructor(
        private proxyBypassDomainRepository: ProxyBypassDomainRepository,
        private networksetupProxyService: NetworksetupProxyService,
        private networkInterfaceRepository: NetworkInterfaceRepository,
    ) {
    }

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
        return await this.networksetupProxyService.getNetworksetupProxy().map(async (networksetupProxy) => {
            let proxyBypassDomainEntities = await this.proxyBypassDomainRepository.resolveAll();
            let allInterfaces = await this.networkInterfaceRepository.resolveAllInterface();
            let promises = allInterfaces.map((ni) => ni.setProxyBypassDomains(networksetupProxy, proxyBypassDomainEntities));
            return await Promise.all(promises);
        }).getOrElse(() => Promise.resolve(undefined));
    }
}
