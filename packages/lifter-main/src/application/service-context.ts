import { AutoResponderService } from "../domains/proxy/auto-responder/auto-responder-service";
import { FindMatchEntry } from "../domains/proxy/auto-responder/specs/find-match-entry";
import { ClientRequestService } from "../domains/proxy/client-request/client-request-service";
import { RewriteRuleService } from "../domains/proxy/rewrite-rule/rewrite-rule-service";
import { SslCertificatePath } from "../libs/ssl-certificate-path";
import { LifecycleContextService } from "./lifecycle-context-service";
import { ProxyService } from "./proxy/proxy-service";
import { CertificateService } from "./settings/certificate/certificate-service";
import { NetworkInterfaceService } from "./settings/network-interface/network-interface-service";
import { NetworksetupProxyService } from "./settings/networksetup-proxy/networksetup-proxy-service";
import { PacFileService } from "./settings/pac-file/pac-file-service";
import { ProxyBypassDomainService } from "./settings/proxy-bypass-domain/proxy-bypass-domain-service";
import { ProxyCommandGrantService } from "./settings/proxy-command-grant/proxy-command-grant-service";
import { ProxySettingService } from "./settings/proxy-setting/proxy-setting-service";
import { UserSettingsService } from "./settings/user-settings/user-settings-service";

export class ServiceContext {
    public clientRequestService: ClientRequestService;
    public networkInterfaceService: NetworkInterfaceService;
    public networksetupProxyService: NetworksetupProxyService;
    public proxyService: ProxyService;
    public certificateService: CertificateService;
    public proxySettingService: ProxySettingService;
    public proxyBypassDomainService: ProxyBypassDomainService;
    public userSettingsService: UserSettingsService;
    public autoResponderService: AutoResponderService;
    public pacFileService: PacFileService;
    public rewriteRuleService: RewriteRuleService;
    public proxyCommandGrantService: ProxyCommandGrantService;

    constructor(sslCertificatePath: SslCertificatePath, lifecycleContextService: LifecycleContextService) {
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

        this.proxyCommandGrantService = new ProxyCommandGrantService(lifecycleContextService.networksetupProxyFactory);

        this.networkInterfaceService = new NetworkInterfaceService(lifecycleContextService.networkInterfaceFactory);

        this.networksetupProxyService = new NetworksetupProxyService(
            lifecycleContextService.networksetupProxyFactory,
            this.networkInterfaceService,
            this.proxyCommandGrantService,
        );

        this.certificateService = new CertificateService(sslCertificatePath);
        this.userSettingsService = new UserSettingsService(lifecycleContextService.userSettingsStorage);

        this.pacFileService = new PacFileService(this.autoResponderService, this.networksetupProxyService);

        this.proxySettingService = new ProxySettingService(
            this.userSettingsService,
            this.pacFileService,
            this.networksetupProxyService,
            this.networkInterfaceService,
        );

        this.clientRequestService = new ClientRequestService(
            this.autoResponderService,
            this.pacFileService,
            lifecycleContextService.clientRequestFactory,
            lifecycleContextService.clientRequestRepository,
        );

        this.proxyService = new ProxyService(sslCertificatePath, this.clientRequestService);

        this.proxyBypassDomainService = new ProxyBypassDomainService(
            lifecycleContextService.proxyBypassDomainFactory,
            lifecycleContextService.proxyBypassDomainRepository,
            this.networksetupProxyService,
        );

        this.userSettingsService = new UserSettingsService(lifecycleContextService.userSettingsStorage);
    }

    async load() {
        await Promise.all([
            this.networksetupProxyService.load(),
            this.proxyCommandGrantService.load(),
        ]);
        await this.proxyBypassDomainService.load();
    }
}
