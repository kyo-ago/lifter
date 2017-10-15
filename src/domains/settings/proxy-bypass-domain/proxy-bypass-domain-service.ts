import {getProxyByPassDomains} from "../../../libs/exec-commands";
import {NetworkInterfaceRepository} from "../network-interface/lifecycle/network-interface-repository";
import {ProxyBypassDomainFactory} from "./lifecycle/proxy-bypass-domain-factory";
import {ProxyBypassDomainRepository} from "./lifecycle/proxy-bypass-domain-repository";
import {ProxyBypassDomainEntity} from "./proxy-bypass-domain-entity";
import {networksetupProxy} from "../lib/networksetup-proxy-command";

export class ProxyBypassDomainService {
    constructor(
        private proxyBypassDomainFactory: ProxyBypassDomainFactory,
        private proxyBypassDomainRepository: ProxyBypassDomainRepository,
        private networkInterfaceRepository: NetworkInterfaceRepository,
    ) {
    }

    async load() {
        await this.proxyBypassDomainRepository.load();
        let proxyBypassDomainEntities = await this.proxyBypassDomainRepository.resolveAll();
        let networkInterfaceEntities = await this.networkInterfaceRepository.resolveAllEnableInterface();
        let proxyByPassDomains = await Promise.all(networkInterfaceEntities.map((ni) => getProxyByPassDomains(ni)));
        let proxyByPassUniqueDomains = Object.keys(proxyByPassDomains.join('\n').split(/\n+/).reduce((base, cur) => {
            base[cur] = true;
            return base;
        }, <{[key: string]: boolean}>{}));

        return proxyByPassUniqueDomains
            .map((domain) => this.proxyBypassDomainFactory.create(domain))
            .filter((entity) => !proxyBypassDomainEntities.find((e) => e.getIdentity().equals(entity.getIdentity())))
            .map((entity) => this.proxyBypassDomainRepository.store(entity))
        ;
    }

    resolveAll() {
        return this.proxyBypassDomainRepository.resolveAll();
    }

    async overwriteAll(proxyBypassDomainEntities: ProxyBypassDomainEntity[]) {
        await this.proxyBypassDomainRepository.overwriteAll(proxyBypassDomainEntities);
        let domainNames = proxyBypassDomainEntities.map((entity) => entity.pattern);
        let networkInterfaceEntities = await this.networkInterfaceRepository.resolveAllEnableInterface();
        return networkInterfaceEntities.map((networkInterfaceEntity) => {
            return networksetupProxy.setproxybypassdomains(networkInterfaceEntity.serviceName, domainNames);
        });
    }
}
