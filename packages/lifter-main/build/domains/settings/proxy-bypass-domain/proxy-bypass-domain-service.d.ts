import { NetworkInterfaceRepository } from "../network-interface/lifecycle/network-interface-repository";
import { NetworksetupProxyService } from "../networksetup-proxy-service/networksetup-proxy-service";
import { ProxyBypassDomainRepository } from "./lifecycle/proxy-bypass-domain-repository";
import { ProxyBypassDomainEntity } from "./proxy-bypass-domain-entity";
export declare class ProxyBypassDomainService {
    private proxyBypassDomainRepository;
    private networksetupProxyService;
    private networkInterfaceRepository;
    constructor(
        proxyBypassDomainRepository: ProxyBypassDomainRepository,
        networksetupProxyService: NetworksetupProxyService,
        networkInterfaceRepository: NetworkInterfaceRepository
    );
    load(): Promise<
        {
            stdout: string;
            stderr: string;
        }[]
    >;
    resolveAll(): Promise<ProxyBypassDomainEntity[]>;
    overwriteAll(
        proxyBypassDomainEntities: ProxyBypassDomainEntity[]
    ): Promise<
        {
            stdout: string;
            stderr: string;
        }[]
    >;
    private setProxyBypassDomains();
}
