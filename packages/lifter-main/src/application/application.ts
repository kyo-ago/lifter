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
import { PacFileService } from "../domains/proxy/pac-file/pac-file-service";
import { ProjectEntity } from "../domains/proxy/project/project-entity";
import { RewriteRuleFactory } from "../domains/proxy/rewrite-rule/lifecycle/rewrite-rule-factory";
import { CertificateService } from "../domains/settings/certificate/certificate-service";
import { NetworksetupProxyService } from "../domains/settings/networksetup-proxy-service/networksetup-proxy-service";
import { ProxyBypassDomainFactory } from "../domains/settings/proxy-bypass-domain/lifecycle/proxy-bypass-domain-factory";
import { ProxyBypassDomainService } from "../domains/settings/proxy-bypass-domain/proxy-bypass-domain-service";
import { ProxySettingService } from "../domains/settings/proxy-setting/proxy-setting-service";
import { LifecycleContextService } from "./lifecycle-context-service";
import { ProxyService } from "./proxy/proxy-service";
import { UIEventService } from "./ui-event/ui-event-service";

export class Application {
    private autoResponderService: AutoResponderService;
    private networksetupProxyService: NetworksetupProxyService;
    private proxyService: ProxyService;
    private certificateService: CertificateService;
    private proxySettingService: ProxySettingService;
    private pacFileService: PacFileService;
    private proxyBypassDomainService: ProxyBypassDomainService;
    private userSettingStorage: UserSettingStorage;
    protected uiEventService: UIEventService;

    constructor(
        httpSslCaDirPath: string,
        projectEntity: ProjectEntity,
        public lifecycleContextService: LifecycleContextService,
    ) {
        this.autoResponderService = new AutoResponderService(
            this.lifecycleContextService.autoResponderFactory,
            this.lifecycleContextService.autoResponderRepository,
            new FindMatchEntry(this.lifecycleContextService.localFileResponderFactory),
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
            this.lifecycleContextService.autoResponderRepository,
            this.networksetupProxyService,
            this.userSettingStorage,
        );

        this.proxyService = new ProxyService(
            httpSslCaDirPath,
            this.pacFileService,
            this.lifecycleContextService.autoResponderRepository,
            this.lifecycleContextService.clientRequestRepository,
            this.lifecycleContextService.rewriteRuleRepository,
            this.lifecycleContextService.clientRequestFactory,
            this.networksetupProxyService,
        );

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
        );
    }

    async load() {
        await Promise.all([
            this.userSettingStorage.load(),
            this.lifecycleContextService.load(),
        ]);
        await this.proxyBypassDomainService.load();
        await this.pacFileService.load();
        await this.networksetupProxyService.load();
        this.uiEventService.subscribe();
    }

    start(callback: (clientRequestEntity: ClientRequestEntity) => void) {
        return this.proxyService.start(callback);
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
        return {
            autoResponderEntries: autoResponderEntries.map((entity): AutoResponderEntityJSON => entity.json),
            clientRequestEntries: clientRequestEntries.map((entity): ClientRequestEntityJSON => entity.json),
            certificateState: await this.certificateService.getCurrentStatus(),
            proxySettingStatus: await this.proxySettingService.getCurrentStatus(),
            proxyCommandGrantStatus: this.networksetupProxyService.getCurrentStatus(),
            noAutoEnableProxySetting: this.userSettingStorage.resolve("noAutoEnableProxy"),
            noPacFileProxySetting: this.userSettingStorage.resolve("noPacFileProxy"),
        };
    }

    async getProxyBypassDomains(): Promise<ProxyBypassDomainEntityJSON[]> {
        let allEntities = await this.proxyBypassDomainService.resolveAll();
        return allEntities.map(entity => entity.json);
    }
    saveProxyBypassDomainJSON(allJsons: ProxyBypassDomainEntityJSON[]): Promise<void> {
        let entities = allJsons.map(json => ProxyBypassDomainFactory.fromJSON(json));
        return this.proxyBypassDomainService.overwriteAll(entities).then(() => {});
    }

    async getRewriteRules(): Promise<RewriteRuleEntityJSON[]> {
        let allEntities = await this.lifecycleContextService.rewriteRuleRepository.resolveAll();
        return allEntities.map(entity => entity.json);
    }
    saveRewriteRuleJSON(allJsons: RewriteRuleEntityJSON[]): Promise<void> {
        let entities = allJsons.map(json => RewriteRuleFactory.fromJSON(json));
        return this.lifecycleContextService.rewriteRuleRepository.overwriteAll(entities).then(() => {});
    }
}
