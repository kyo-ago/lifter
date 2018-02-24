import { NetworksetupProxyService } from "../networksetup-proxy-service/networksetup-proxy-service";
import { ProxyBypassDomainRepository } from "./lifecycle/proxy-bypass-domain-repository";
import { ProxyBypassDomainEntity } from "./proxy-bypass-domain-entity";

export class ProxyBypassDomainService {
    constructor(
        private proxyBypassDomainRepository: ProxyBypassDomainRepository,
        private networksetupProxyService: NetworksetupProxyService,
    ) {}

    load(): Promise<void> {
        return this.setProxyBypassDomains();
    }

    resolveAll() {
        return this.proxyBypassDomainRepository.resolveAll();
    }

    async overwriteAll(proxyBypassDomainEntities: ProxyBypassDomainEntity[]): Promise<void> {
        await this.proxyBypassDomainRepository.overwriteAll(proxyBypassDomainEntities);
        return await this.setProxyBypassDomains();
    }

    private async setProxyBypassDomains(): Promise<void> {
        let proxyBypassDomainEntities = await this.proxyBypassDomainRepository.resolveAll();
        return await this.networksetupProxyService.setProxyBypassDomains(proxyBypassDomainEntities);
    }
}
