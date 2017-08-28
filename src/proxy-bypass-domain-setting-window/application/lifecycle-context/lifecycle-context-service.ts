import {ProxyBypassDomainFactory} from '../../domain/proxy-bypass-domain/lifecycle/proxy-bypass-domain-factory';
import {ProxyBypassDomainRepository} from '../../domain/proxy-bypass-domain/lifecycle/proxy-bypass-domain-repository';

export class LifecycleContextService {
    public ProxyBypassDomainRepository = new ProxyBypassDomainRepository();
    public proxyBypassDomainFactory = new ProxyBypassDomainFactory();
}
