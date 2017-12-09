import { ProxyBypassDomainFactory } from "../../../../domains/proxy-bypass-domain/lifecycle/proxy-bypass-domain-factory";
import { ProxyBypassDomainRepository } from "../../../../domains/proxy-bypass-domain/lifecycle/proxy-bypass-domain-repository";

export class LifecycleContextService {
    public ProxyBypassDomainRepository = new ProxyBypassDomainRepository();
    public proxyBypassDomainFactory = new ProxyBypassDomainFactory();
}
