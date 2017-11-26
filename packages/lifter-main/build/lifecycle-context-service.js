"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auto_responder_entry_factory_1 = require("./domains/proxy/auto-responder-entry/lifecycle/auto-responder-entry-factory");
const auto_responder_entry_repositoty_1 = require("./domains/proxy/auto-responder-entry/lifecycle/auto-responder-entry-repositoty");
const client_request_factory_1 = require("./domains/proxy/client-request/lifecycle/client-request-factory");
const client_request_repository_1 = require("./domains/proxy/client-request/lifecycle/client-request-repository");
const local_file_responder_factory_1 = require("./domains/proxy/local-file-responder/lifecycle/local-file-responder-factory");
const rewrite_rule_repository_1 = require("./domains/proxy/rewrite-rule/lifecycle/rewrite-rule-repository");
const network_interface_factory_1 = require("./domains/settings/network-interface/lifecycle/network-interface-factory");
const network_interface_repository_1 = require("./domains/settings/network-interface/lifecycle/network-interface-repository");
const proxy_bypass_domain_repository_1 = require("./domains/settings/proxy-bypass-domain/lifecycle/proxy-bypass-domain-repository");
class LifecycleContextService {
    constructor(projectEntity) {
        this.clientRequestRepository = new client_request_repository_1.ClientRequestRepository();
        this.clientRequestFactory = new client_request_factory_1.ClientRequestFactory();
        this.localFileResponderFactory = new local_file_responder_factory_1.LocalFileResponderFactory();
        this.networkInterfaceFactory = new network_interface_factory_1.NetworkInterfaceFactory();
        this.networkInterfaceRepository = new network_interface_repository_1.NetworkInterfaceRepository(
            this.networkInterfaceFactory
        );
        this.autoResponderEntryRepository = new auto_responder_entry_repositoty_1.AutoResponderEntryRepository(
            projectEntity,
            this.localFileResponderFactory
        );
        this.proxyBypassDomainRepository = new proxy_bypass_domain_repository_1.ProxyBypassDomainRepository(
            projectEntity
        );
        this.rewriteRuleRepository = new rewrite_rule_repository_1.RewriteRuleRepository(projectEntity);
        this.autoResponderEntryFactory = new auto_responder_entry_factory_1.AutoResponderEntryFactory(projectEntity);
    }
    load() {
        return Promise.all([
            this.autoResponderEntryRepository.load(),
            this.rewriteRuleRepository.load(),
            this.proxyBypassDomainRepository.load()
        ]);
    }
}
exports.LifecycleContextService = LifecycleContextService;
