import { ProxyBypassDomainEntityJSON } from "@lifter/lifter-common";
import { NetworksetupProxyService } from "../networksetup-proxy/networksetup-proxy-service";
import { ProxyBypassDomainFactory } from "./lifecycle/proxy-bypass-domain-factory";
import { ProxyBypassDomainRepository } from "./lifecycle/proxy-bypass-domain-repository";

export interface getProxyBypassDomains {
    applyAll: (domains: string[]) => Promise<void>;
    fetchAll: () => Promise<ProxyBypassDomainEntityJSON[]>;
}

export class ProxyBypassDomainService {
    constructor(
        private proxyBypassDomainFactory: ProxyBypassDomainFactory,
        private proxyBypassDomainRepository: ProxyBypassDomainRepository,
        private networksetupProxyService: NetworksetupProxyService,
    ) {}

    load(): Promise<void> {
        return this.setProxyBypassDomains();
    }

    getProxyBypassDomains(): getProxyBypassDomains {
        return {
            applyAll: (domains: string[]): Promise<void> => {
                return this.overwriteAll(domains);
            },
            fetchAll: (): Promise<ProxyBypassDomainEntityJSON[]> => {
                return this.fetchAllJSONs();
            },
        };
    }

    private async overwriteAll(domains: string[]): Promise<void> {
        let entities = domains.map(domain => this.proxyBypassDomainFactory.create(domain));
        await this.proxyBypassDomainRepository.overwriteAll(entities);
        return await this.setProxyBypassDomains();
    }

    private async fetchAllJSONs(): Promise<ProxyBypassDomainEntityJSON[]> {
        let allEntities = await this.proxyBypassDomainRepository.resolveAll();
        return allEntities.map(entity => entity.json);
    }

    private async setProxyBypassDomains(): Promise<void> {
        let proxyBypassDomainEntities = await this.proxyBypassDomainRepository.resolveAll();
        return await this.networksetupProxyService.setProxyBypassDomains(proxyBypassDomainEntities);
    }
}
