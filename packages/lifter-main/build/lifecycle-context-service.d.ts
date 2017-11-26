import { AutoResponderEntryFactory } from "./domains/proxy/auto-responder-entry/lifecycle/auto-responder-entry-factory";
import { AutoResponderEntryRepository } from "./domains/proxy/auto-responder-entry/lifecycle/auto-responder-entry-repositoty";
import { ClientRequestFactory } from "./domains/proxy/client-request/lifecycle/client-request-factory";
import { ClientRequestRepository } from "./domains/proxy/client-request/lifecycle/client-request-repository";
import { LocalFileResponderFactory } from "./domains/proxy/local-file-responder/lifecycle/local-file-responder-factory";
import { ProjectEntity } from "./domains/proxy/project/project-entity";
import { RewriteRuleRepository } from "./domains/proxy/rewrite-rule/lifecycle/rewrite-rule-repository";
import { NetworkInterfaceFactory } from "./domains/settings/network-interface/lifecycle/network-interface-factory";
import { NetworkInterfaceRepository } from "./domains/settings/network-interface/lifecycle/network-interface-repository";
import { ProxyBypassDomainRepository } from "./domains/settings/proxy-bypass-domain/lifecycle/proxy-bypass-domain-repository";
export declare class LifecycleContextService {
    clientRequestRepository: ClientRequestRepository;
    clientRequestFactory: ClientRequestFactory;
    localFileResponderFactory: LocalFileResponderFactory;
    networkInterfaceFactory: NetworkInterfaceFactory;
    autoResponderEntryRepository: AutoResponderEntryRepository;
    autoResponderEntryFactory: AutoResponderEntryFactory;
    networkInterfaceRepository: NetworkInterfaceRepository;
    proxyBypassDomainRepository: ProxyBypassDomainRepository;
    rewriteRuleRepository: RewriteRuleRepository;
    constructor(projectEntity: ProjectEntity);
    load(): Promise<[void, void, void]>;
}
