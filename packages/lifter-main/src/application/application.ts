import { getAutoResponder } from "../domains/proxy/auto-responder/auto-responder-service";
import { getClientRequestService } from "../domains/proxy/client-request/client-request-service";
import { getRewriteRules } from "../domains/proxy/rewrite-rule/rewrite-rule-service";
import { getCertificateService } from "../domains/settings/certificate/certificate-service";
import { getNetworksetupProxyService } from "../domains/settings/networksetup-proxy-service/networksetup-proxy-service";
import { getProxyBypassDomains } from "../domains/settings/proxy-bypass-domain/proxy-bypass-domain-service";
import { getProxySettingService } from "../domains/settings/proxy-setting/proxy-setting-service";
import { getUserSetting } from "../domains/settings/user-settings/user-settings-service";
import { LifecycleContextService } from "./lifecycle-context-service";
import { ServiceContext } from "./service-context";

export class Application {
    constructor(protected lifecycleContextService: LifecycleContextService, protected serviceContext: ServiceContext) {}

    async load() {
        await this.lifecycleContextService.load();
        await this.serviceContext.load();
    }

    async startup() {
        await this.serviceContext.userSettingsService.isAutoEnableProxy({
            Some: () => this.serviceContext.proxySettingService.startup(),
            None: () => Promise.resolve(),
        });
        await this.serviceContext.proxyService.listen();
    }

    async shutdown(): Promise<void> {
        await this.serviceContext.proxySettingService.shutdown();
        await this.serviceContext.proxyService.shutdown();
    }

    getAutoResponder(): getAutoResponder {
        return this.serviceContext.autoResponderService.getAutoResponder();
    }

    getCertificateService(): getCertificateService {
        return this.serviceContext.certificateService.getCertificateService();
    }

    getNetworksetupProxyService(): getNetworksetupProxyService {
        return this.serviceContext.networksetupProxyService.getNetworksetupProxyService();
    }

    getClientRequestService(): getClientRequestService {
        return this.serviceContext.clientRequestService.getClientRequestService();
    }

    getProxyBypassDomains(): getProxyBypassDomains {
        return this.serviceContext.proxyBypassDomainService.getProxyBypassDomains();
    }

    getRewriteRules(): getRewriteRules {
        return this.serviceContext.rewriteRuleService.getRewriteRules();
    }

    getUserSetting(): getUserSetting {
        return this.serviceContext.userSettingsService.getUserSetting();
    }

    getProxySettingService(): getProxySettingService {
        return this.serviceContext.proxySettingService.getProxySettingService();
    }
}
