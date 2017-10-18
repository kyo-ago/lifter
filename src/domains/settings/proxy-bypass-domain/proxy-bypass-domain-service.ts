import {getProxyByPassDomains} from "../../../libs/exec-commands";
import {networksetupProxy} from "../lib/networksetup-proxy-command";
import {NetworkInterfaceRepository} from "../network-interface/lifecycle/network-interface-repository";
import {ProxyBypassDomainRepository} from "./lifecycle/proxy-bypass-domain-repository";
import {ProxyBypassDomainEntity} from "./proxy-bypass-domain-entity";

export class ProxyBypassDomainService {
    constructor(
        private proxyBypassDomainRepository: ProxyBypassDomainRepository,
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
        return this.setProxyBypassDomains();
    }

    private async setProxyBypassDomains() {
        let hasGrant = await networksetupProxy.hasGrant();
        if (!hasGrant) {
            return;
        }
        let proxyBypassDomainEntities = await this.proxyBypassDomainRepository.resolveAll();
        if (!proxyBypassDomainEntities.length) {
            return;
        }
        let proxyBypassDomains = proxyBypassDomainEntities.map((entity) => entity.name);
        let resolveAllEnableInterfaces = await this.networkInterfaceRepository.resolveAllEnableInterface();
        return await Promise.all(resolveAllEnableInterfaces.map(async (enableInterface) => {
            let domain = await getProxyByPassDomains(enableInterface);
            let domains = domain.split(/\n/).concat(proxyBypassDomains);
            let uniqueDomains = Array.from(new Set(domains));
            return networksetupProxy.setproxybypassdomains(enableInterface.serviceName, uniqueDomains);
        }));
    }
}
