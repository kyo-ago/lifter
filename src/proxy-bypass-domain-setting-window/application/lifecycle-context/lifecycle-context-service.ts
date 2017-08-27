import {ProxyBypassDomainRepository} from "../../domain/proxy-bypass-domain/lifecycle/proxy-bypass-domain-repository";
import {ProxyBypassDomainFactory} from "../../domain/proxy-bypass-domain/lifecycle/proxy-bypass-domain-factory";

export class LifecycleContextService {
    public proxyBypassDomainRepository = new ProxyBypassDomainRepository();
    public proxyBypassDomainFactory = new ProxyBypassDomainFactory();
}
