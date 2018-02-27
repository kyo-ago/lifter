import { AutoResponderFactory } from "../domains/proxy/auto-responder/lifecycle/auto-responder-factory";
import { AutoResponderRepository } from "../domains/proxy/auto-responder/lifecycle/auto-responder-repositoty";
import { ClientRequestFactory } from "../domains/proxy/client-request/lifecycle/client-request-factory";
import { ClientRequestRepository } from "../domains/proxy/client-request/lifecycle/client-request-repository";
import { LocalFileResponderFactory } from "../domains/proxy/local-file-responder/lifecycle/local-file-responder-factory";
import { ProjectEntity } from "../domains/proxy/project/project-entity";
import { RewriteRuleRepository } from "../domains/proxy/rewrite-rule/lifecycle/rewrite-rule-repository";
import { NetworkInterfaceFactory } from "../domains/settings/network-interface/lifecycle/network-interface-factory";
import { NetworkInterfaceRepository } from "../domains/settings/network-interface/lifecycle/network-interface-repository";
import { ProxyBypassDomainRepository } from "../domains/settings/proxy-bypass-domain/lifecycle/proxy-bypass-domain-repository";

export class LifecycleContextService {
    public clientRequestRepository = new ClientRequestRepository();
    public clientRequestFactory = new ClientRequestFactory();
    public localFileResponderFactory = new LocalFileResponderFactory();
    public networkInterfaceFactory = new NetworkInterfaceFactory();

    public autoResponderRepository: AutoResponderRepository;
    public autoResponderFactory: AutoResponderFactory;
    public networkInterfaceRepository: NetworkInterfaceRepository;
    public proxyBypassDomainRepository: ProxyBypassDomainRepository;
    public rewriteRuleRepository: RewriteRuleRepository;

    constructor(projectEntity: ProjectEntity) {
        this.networkInterfaceRepository = new NetworkInterfaceRepository(this.networkInterfaceFactory);
        this.autoResponderRepository = new AutoResponderRepository(projectEntity);
        this.proxyBypassDomainRepository = new ProxyBypassDomainRepository(projectEntity);
        this.rewriteRuleRepository = new RewriteRuleRepository(projectEntity);
        this.autoResponderFactory = new AutoResponderFactory(projectEntity);
    }

    load() {
        return Promise.all([
            this.autoResponderRepository.load(),
            this.rewriteRuleRepository.load(),
            this.proxyBypassDomainRepository.load(),
        ]);
    }
}
