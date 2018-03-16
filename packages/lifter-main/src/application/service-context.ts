import { UserSettingStorage } from "../domains/libs/user-setting-storage";
import { AutoResponderService } from "../domains/proxy/auto-responder/auto-responder-service";
import { FindMatchEntry } from "../domains/proxy/auto-responder/specs/find-match-entry";
import { ClientRequestService } from "../domains/proxy/client-request/client-request-service";
import { ClientResponder } from "../domains/proxy/client-responder/client-responder";
import { PacFileService } from "../domains/proxy/pac-file/pac-file-service";
import { ProjectEntity } from "../domains/proxy/project/project-entity";
import { RewriteRuleService } from "../domains/proxy/rewrite-rule/rewrite-rule-service";
import { CertificateService } from "../domains/settings/certificate/certificate-service";
import { NetworksetupProxyService } from "../domains/settings/networksetup-proxy-service/networksetup-proxy-service";
import { ProxyBypassDomainService } from "../domains/settings/proxy-bypass-domain/proxy-bypass-domain-service";
import { ProxySettingService } from "../domains/settings/proxy-setting/proxy-setting-service";
import { LifecycleContextService } from "./lifecycle-context-service";
import { ProxyService } from "./proxy/proxy-service";

export class ServiceContext {
    public clientRequestService: ClientRequestService;
    public networksetupProxyService: NetworksetupProxyService;
    public proxyService: ProxyService;
    public certificateService: CertificateService;
    public proxySettingService: ProxySettingService;
    public proxyBypassDomainService: ProxyBypassDomainService;
    public userSettingStorage: UserSettingStorage;

    // Protected for testing
    public autoResponderService: AutoResponderService;
    public clientResponder: ClientResponder;
    public pacFileService: PacFileService;
    public rewriteRuleService: RewriteRuleService;

    constructor(
        httpSslCaDirPath: string,
        projectEntity: ProjectEntity,
        lifecycleContextService: LifecycleContextService,
    ) {
        this.clientRequestService = new ClientRequestService(
            lifecycleContextService.clientRequestFactory,
            lifecycleContextService.clientRequestRepository,
        );

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

        this.userSettingStorage = new UserSettingStorage(projectEntity);

        this.networksetupProxyService = new NetworksetupProxyService(
            this.userSettingStorage,
            lifecycleContextService.networkInterfaceRepository,
        );

        this.certificateService = new CertificateService(httpSslCaDirPath);

        this.proxySettingService = new ProxySettingService(
            this.networksetupProxyService,
            lifecycleContextService.networkInterfaceRepository,
        );

        this.pacFileService = new PacFileService(
            this.autoResponderService,
            this.networksetupProxyService,
            this.userSettingStorage,
        );

        this.clientResponder = new ClientResponder(
            this.autoResponderService,
            this.pacFileService,
            this.clientRequestService,
        );

        this.proxyService = new ProxyService(httpSslCaDirPath, this.networksetupProxyService, this.clientResponder);

        this.proxyBypassDomainService = new ProxyBypassDomainService(
            lifecycleContextService.proxyBypassDomainFactory,
            lifecycleContextService.proxyBypassDomainRepository,
            this.networksetupProxyService,
        );
    }

    async load() {
        await this.userSettingStorage.load();
        await this.proxyBypassDomainService.load();
        await this.pacFileService.load();
        await this.networksetupProxyService.load();
    }
}