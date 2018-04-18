import { AutoResponderService } from "../domains/proxy/auto-responder/auto-responder-service";
import { FindMatchEntry } from "../domains/proxy/auto-responder/specs/find-match-entry";
import { ClientRequestService } from "../domains/proxy/client-request/client-request-service";
import { PacFileService } from "../domains/proxy/pac-file/pac-file-service";
import { RewriteRuleService } from "../domains/proxy/rewrite-rule/rewrite-rule-service";
import { CertificateService } from "../domains/settings/certificate/certificate-service";
import { NetworksetupProxyService } from "../domains/settings/networksetup-proxy-service/networksetup-proxy-service";
import { ProxyBypassDomainService } from "../domains/settings/proxy-bypass-domain/proxy-bypass-domain-service";
import { ProxySettingService } from "../domains/settings/proxy-setting/proxy-setting-service";
import { UserSettingsService } from "../domains/settings/user-settings/user-settings-service";
import { LifecycleContextService } from "./lifecycle-context-service";
import { ProxyService } from "./proxy/proxy-service";

export class ServiceContext {
    public clientRequestService: ClientRequestService;
    public networksetupProxyService: NetworksetupProxyService;
    public proxyService: ProxyService;
    public certificateService: CertificateService;
    public proxySettingService: ProxySettingService;
    public proxyBypassDomainService: ProxyBypassDomainService;
    public userSettingsService: UserSettingsService;
    public autoResponderService: AutoResponderService;
    public pacFileService: PacFileService;
    public rewriteRuleService: RewriteRuleService;

    constructor(httpSslCaDirPath: string, lifecycleContextService: LifecycleContextService) {
        this.rewriteRuleService = new RewriteRuleService(
            lifecycleContextService.rewriteRuleFactory,
            lifecycleContextService.rewriteRuleRepository,
        );

        this.autoResponderService = new AutoResponderService(
            lifecycleContextService.autoResponderFactory,
            lifecycleContextService.autoResponderRepository,
            new FindMatchEntry(lifecycleContextService.localFileResponseFactory),
            this.rewriteRuleService,
        );

        this.networksetupProxyService = new NetworksetupProxyService(
            lifecycleContextService.networkInterfaceRepository,
        );

        this.certificateService = new CertificateService(httpSslCaDirPath);
        this.userSettingsService = new UserSettingsService(lifecycleContextService.userSettingsStorage);

        this.pacFileService = new PacFileService(this.autoResponderService, this.networksetupProxyService);

        this.proxySettingService = new ProxySettingService(
            this.userSettingsService,
            this.pacFileService,
            this.networksetupProxyService,
            lifecycleContextService.networkInterfaceRepository,
        );

        this.clientRequestService = new ClientRequestService(
            this.autoResponderService,
            this.pacFileService,
            lifecycleContextService.clientRequestFactory,
            lifecycleContextService.clientRequestRepository,
        );

        this.proxyService = new ProxyService(httpSslCaDirPath, this.clientRequestService);

        this.proxyBypassDomainService = new ProxyBypassDomainService(
            lifecycleContextService.proxyBypassDomainFactory,
            lifecycleContextService.proxyBypassDomainRepository,
            this.networksetupProxyService,
        );

        this.userSettingsService = new UserSettingsService(lifecycleContextService.userSettingsStorage);
    }

    async load() {
        await this.proxyBypassDomainService.load();
        await this.networksetupProxyService.load();
    }
}
