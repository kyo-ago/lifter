import {
    ApplicationMainStateJSON,
    AutoResponderEntityJSON,
    ClientRequestEntityJSON,
    ProxyBypassDomainEntityJSON,
    RewriteRuleEntityJSON,
} from "@lifter/lifter-common";
import { UserSettingStorage } from "../domains/libs/user-setting-storage";
import { AutoResponderService } from "../domains/proxy/auto-responder/auto-responder-service";
import { FindMatchEntry } from "../domains/proxy/auto-responder/specs/find-match-entry";
import { ClientRequestEntity } from "../domains/proxy/client-request/client-request-entity";
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
import { UIEventService } from "./ui-event/ui-event-service";

export class Application {
    private clientRequestService: ClientRequestService;
    private networksetupProxyService: NetworksetupProxyService;
    private proxyService: ProxyService;
    private certificateService: CertificateService;
    private proxySettingService: ProxySettingService;
    private proxyBypassDomainService: ProxyBypassDomainService;
    private userSettingStorage: UserSettingStorage;
    private uiEventService: UIEventService;

    // Protected for testing
    protected autoResponderService: AutoResponderService;
    protected clientResponder: ClientResponder;
    protected pacFileService: PacFileService;
    protected rewriteRuleService: RewriteRuleService;

    constructor(
        httpSslCaDirPath: string,
        projectEntity: ProjectEntity,
        public lifecycleContextService: LifecycleContextService,
    ) {
        this.clientRequestService = new ClientRequestService(
            this.lifecycleContextService.clientRequestFactory,
            this.lifecycleContextService.clientRequestRepository,
        );

        this.rewriteRuleService = new RewriteRuleService(
            this.lifecycleContextService.rewriteRuleFactory,
            this.lifecycleContextService.rewriteRuleRepository,
        );

        this.autoResponderService = new AutoResponderService(
            this.lifecycleContextService.autoResponderFactory,
            this.lifecycleContextService.autoResponderRepository,
            new FindMatchEntry(this.lifecycleContextService.localFileResponseFactory),
        );

        this.userSettingStorage = new UserSettingStorage(projectEntity);

        this.networksetupProxyService = new NetworksetupProxyService(
            this.userSettingStorage,
            this.lifecycleContextService.networkInterfaceRepository,
        );

        this.certificateService = new CertificateService(httpSslCaDirPath);

        this.proxySettingService = new ProxySettingService(
            this.networksetupProxyService,
            this.lifecycleContextService.networkInterfaceRepository,
        );

        this.pacFileService = new PacFileService(
            this.autoResponderService,
            this.networksetupProxyService,
            this.userSettingStorage,
        );

        this.clientResponder = new ClientResponder(
            this.autoResponderService,
            this.pacFileService,
            this.rewriteRuleService,
            this.clientRequestService,
        );

        this.proxyService = new ProxyService(httpSslCaDirPath, this.networksetupProxyService, this.clientResponder);

        this.proxyBypassDomainService = new ProxyBypassDomainService(
            this.lifecycleContextService.proxyBypassDomainRepository,
            this.networksetupProxyService,
        );

        this.uiEventService = new UIEventService(
            this.autoResponderService,
            this.certificateService,
            this.networksetupProxyService,
            this.userSettingStorage,
            this.proxySettingService,
            this.proxyBypassDomainService,
            this.lifecycleContextService.rewriteRuleRepository,
        );
    }

    async load() {
        await Promise.all([this.userSettingStorage.load(), this.lifecycleContextService.load()]);
        await this.proxyBypassDomainService.load();
        await this.pacFileService.load();
        await this.networksetupProxyService.load();
        this.uiEventService.subscribe();
    }

    start(callback: (clientRequestEntity: ClientRequestEntity) => void) {
        this.clientRequestService.observable.subscribe(callback);
        return this.proxyService.start();
    }

    async quit(): Promise<void> {
        await Promise.all([
            this.networksetupProxyService.clearAutoProxyUrl(),
            this.proxySettingService.clearProxyState(),
        ]);
    }

    async getMainState(): Promise<ApplicationMainStateJSON> {
        let autoResponderEntries = await this.lifecycleContextService.autoResponderRepository.resolveAll();
        let clientRequestEntries = this.lifecycleContextService.clientRequestRepository.resolveAll();
        let proxyBypassDomains = await this.proxyBypassDomainService.resolveAll();
        let rewriteRules = await this.lifecycleContextService.rewriteRuleRepository.resolveAll();
        return {
            autoResponderEntries: autoResponderEntries.map((entity): AutoResponderEntityJSON => entity.json),
            clientRequestEntries: clientRequestEntries.map((entity): ClientRequestEntityJSON => entity.json),
            proxyBypassDomainEntries: proxyBypassDomains.map((entity): ProxyBypassDomainEntityJSON => entity.json),
            rewriteRuleEntries: rewriteRules.map((entity): RewriteRuleEntityJSON => entity.json),
            certificateState: await this.certificateService.getCurrentStatus(),
            proxySettingStatus: await this.proxySettingService.getCurrentStatus(),
            proxyCommandGrantStatus: this.networksetupProxyService.getCurrentStatus(),
            noAutoEnableProxySetting: this.userSettingStorage.resolve("noAutoEnableProxy"),
            noPacFileProxySetting: this.userSettingStorage.resolve("noPacFileProxy"),
        };
    }
}
