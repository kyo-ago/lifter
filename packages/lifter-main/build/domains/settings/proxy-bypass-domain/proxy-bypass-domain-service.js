"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ProxyBypassDomainService {
    constructor(proxyBypassDomainRepository, networksetupProxyService, networkInterfaceRepository) {
        this.proxyBypassDomainRepository = proxyBypassDomainRepository;
        this.networksetupProxyService = networksetupProxyService;
        this.networkInterfaceRepository = networkInterfaceRepository;
    }
    load() {
        return this.setProxyBypassDomains();
    }
    resolveAll() {
        return this.proxyBypassDomainRepository.resolveAll();
    }
    async overwriteAll(proxyBypassDomainEntities) {
        await this.proxyBypassDomainRepository.overwriteAll(proxyBypassDomainEntities);
        return await this.setProxyBypassDomains();
    }
    async setProxyBypassDomains() {
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
exports.ProxyBypassDomainService = ProxyBypassDomainService;
