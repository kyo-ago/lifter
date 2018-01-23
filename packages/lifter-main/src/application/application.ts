import {
    AutoResponderEntryEntityJSON,
    CertificateStatus,
    ClientRequestEntityJSON,
    PreferencesJSON,
    ProxyBypassDomainEntityJSON,
    ProxySettingStatus,
    RewriteRuleEntityJSON
} from "@lifter/lifter-common";
import {OutgoingHttpHeaders} from "http";
import {Url} from "url";
import {UserSettingStorage} from "../domains/libs/user-setting-storage";
import {AutoResponderEntryIdentity} from "../domains/proxy/auto-responder-entry/auto-responder-entry-identity";
import {ClientRequestEntity} from "../domains/proxy/client-request/client-request-entity";
import {PacFileService} from "../domains/proxy/pac-file/pac-file-service";
import {ProjectEntity} from "../domains/proxy/project/project-entity";
import {RewriteRuleFactory} from "../domains/proxy/rewrite-rule/lifecycle/rewrite-rule-factory";
import {NetworksetupProxyService} from "../domains/settings/networksetup-proxy-service/networksetup-proxy-service";
import {ProxyBypassDomainFactory} from "../domains/settings/proxy-bypass-domain/lifecycle/proxy-bypass-domain-factory";
import {ProxyBypassDomainService} from "../domains/settings/proxy-bypass-domain/proxy-bypass-domain-service";
import {ProxySettingService} from "../domains/settings/proxy-setting/proxy-setting-service";
import {CertificateService} from "./certificate/certificate-service";
import {ConnectionService} from "./connection/connection-service";
import {ipc} from "./libs/ipc";
import {LifecycleContextService} from "./lifecycle-context-service";
import {ProxyService} from "./proxy/proxy-service";

export class Application {
    public networksetupProxyService: NetworksetupProxyService;
    public proxyService: ProxyService;
    public certificateService: CertificateService;
    public proxySettingService: ProxySettingService;
    public pacFileService: PacFileService;
    public connectionService: ConnectionService;
    public proxyBypassDomainService: ProxyBypassDomainService;
    public userSettingStorage: UserSettingStorage;

    constructor(
        httpSslCaDirPath: string,
        projectEntity: ProjectEntity,
        public lifecycleContextService: LifecycleContextService
    ) {
        this.userSettingStorage = new UserSettingStorage(projectEntity);
        this.networksetupProxyService = new NetworksetupProxyService(
            this.userSettingStorage,
            this.lifecycleContextService.networkInterfaceRepository
        );
        this.proxyService = new ProxyService(httpSslCaDirPath);
        this.certificateService = new CertificateService(httpSslCaDirPath);
        this.proxySettingService = new ProxySettingService(
            this.networksetupProxyService,
            this.lifecycleContextService.networkInterfaceRepository,
            this.userSettingStorage
        );
        this.pacFileService = new PacFileService(
            this.lifecycleContextService.autoResponderEntryRepository,
            this.networksetupProxyService
        );
        this.connectionService = new ConnectionService(
            this.pacFileService,
            this.lifecycleContextService.autoResponderEntryRepository,
            this.lifecycleContextService.clientRequestRepository,
            this.lifecycleContextService.rewriteRuleRepository
        );
        this.proxyBypassDomainService = new ProxyBypassDomainService(
            this.lifecycleContextService.proxyBypassDomainRepository,
            this.networksetupProxyService,
            this.lifecycleContextService.networkInterfaceRepository
        );
    }

    async load() {
        await Promise.all([this.userSettingStorage.load(), this.lifecycleContextService.load()]);
        await this.proxyBypassDomainService.load();
        await this.pacFileService.load();
        await this.networksetupProxyService.load();

        ipc.subscribe("addAutoResponderEntryEntities", async (event: any, filePaths: string[]): Promise<
            AutoResponderEntryEntityJSON[]
        > => {
            let filePromises = filePaths.map(path =>
                this.lifecycleContextService.autoResponderEntryFactory.createFromPath(path)
            );
            let autoResponderEntryEntities = await Promise.all(filePromises);
            await this.lifecycleContextService.autoResponderEntryRepository.storeList(autoResponderEntryEntities);
            return autoResponderEntryEntities.map(autoResponderEntryEntity => autoResponderEntryEntity.json);
        });
        ipc.subscribe("fetchAutoResponderEntryEntities", async (): Promise<AutoResponderEntryEntityJSON[]> => {
            let autoResponderEntryEntities = await this.lifecycleContextService.autoResponderEntryRepository.resolveAll();
            return autoResponderEntryEntities.map(autoResponderEntryEntity => autoResponderEntryEntity.json);
        });
        ipc.subscribe("setNewCertificateStatus", (): Promise<CertificateStatus> => {
            return this.certificateService.getNewStatus();
        });
        ipc.subscribe("setNewProxySettingStatus", (): Promise<ProxySettingStatus> => {
            return this.proxySettingService.getNewStatus();
        });
        ipc.subscribe("deleteAutoResponderEntryEntities", async (event: any, ids: number[]) => {
            await Promise.all(ids
                .map((id) => new AutoResponderEntryIdentity(id))
                .map((autoResponderEntryIdentity) => this.lifecycleContextService.autoResponderEntryRepository.deleteByIdentity(autoResponderEntryIdentity))
            );
            return;
        });
    }

    async start(callback: (clientRequestEntity: ClientRequestEntity) => void) {
        await this.networksetupProxyService.startProxy();
        this.proxyService.createServer(
            (
                url: Url,
                blockCallback: (header: OutgoingHttpHeaders, body: Buffer | string) => void,
                passCallback: (error: Error | undefined) => void
            ) => {
                let clientRequestEntity = this.lifecycleContextService.clientRequestFactory.create(url);
                callback(clientRequestEntity);
                this.connectionService.onRequest(clientRequestEntity, blockCallback, passCallback);
            }
        );
    }

    async quit(): Promise<void> {
        await Promise.all([
            this.networksetupProxyService.clearAutoProxyUrl(),
            this.proxySettingService.clearProxyState()
        ]);
    }

    async getMainState() {
        let autoResponderEntries = await this.lifecycleContextService.autoResponderEntryRepository.resolveAll();
        let clientRequestEntries = this.lifecycleContextService.clientRequestRepository.resolveAll();
        let certificateState = await this.certificateService.getCurrentStatus();
        let proxySettingStatus = await this.proxySettingService.getCurrentStatus();
        let noGrantSetting = this.userSettingStorage.resolve("noGrant");
        let noProxySetting = this.userSettingStorage.resolve("noProxy");
        return {
            autoResponderEntries: autoResponderEntries.map((entity): AutoResponderEntryEntityJSON => entity.json),
            clientRequestEntries: clientRequestEntries.map((entity): ClientRequestEntityJSON => entity.json),
            certificateState: certificateState,
            proxySettingStatus: proxySettingStatus,
            noGrantSetting: noGrantSetting,
            noProxySetting: noProxySetting,
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

    async getPreferences(): Promise<PreferencesJSON[]> {
        return;
    }
    savegetPreferencesJSON(allJsons: PreferencesJSON[]): Promise<void> {
        return;
    }
}
