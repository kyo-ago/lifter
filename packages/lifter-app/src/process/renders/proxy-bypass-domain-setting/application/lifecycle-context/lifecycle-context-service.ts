import { ProxyBypassDomainFactory } from "../../../../../domains/editing/proxy-bypass-domain/lifecycle/proxy-bypass-domain-factory";
import { ProxyBypassDomainRepository } from "../../../../../domains/editing/proxy-bypass-domain/lifecycle/proxy-bypass-domain-repository";

export class LifecycleContextService {
    public ProxyBypassDomainRepository = new ProxyBypassDomainRepository();
    public proxyBypassDomainFactory = new ProxyBypassDomainFactory();
}
