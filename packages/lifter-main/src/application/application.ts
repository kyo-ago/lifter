import {OutgoingHttpHeaders} from 'http';
import {Url} from 'url';
import {UserSettingStorage} from '../domains/libs/user-setting-storage';
import {
    AutoResponderEntryEntity,
    AutoResponderEntryEntityJSON
} from '../domains/proxy/auto-responder-entry/auto-responder-entry-entity';
import {AutoResponderEntryIdentity} from '../domains/proxy/auto-responder-entry/auto-responder-entry-identity';
import {ClientRequestEntity} from '../domains/proxy/client-request/client-request-entity';
import {PacFileService} from '../domains/proxy/pac-file/pac-file-service';
import {ProjectEntity} from '../domains/proxy/project/project-entity';
import {NetworksetupProxyService} from '../domains/settings/networksetup-proxy-service/networksetup-proxy-service';
import {ProxyBypassDomainService} from '../domains/settings/proxy-bypass-domain/proxy-bypass-domain-service';
import {ProxySettingService, ProxySettingStatus} from '../domains/settings/proxy-setting/proxy-setting-service';
import {CertificateService, CertificateStatus} from './certificate/certificate-service';
import {ConnectionService} from './connection/connection-service';
import {ipc} from './lib/ipc';
import {LifecycleContextService} from './lifecycle-context-service';
import {ProxyService} from './proxy/proxy-service';

export class Application {
    private userSettingStorage: UserSettingStorage;
    private networksetupProxyService: NetworksetupProxyService;
    private proxyService: ProxyService;
    private certificateService: CertificateService;
    private proxySettingService: ProxySettingService;
    private pacFileService: PacFileService;
    private connectionService: ConnectionService;
    private proxyBypassDomainService: ProxyBypassDomainService;

    constructor(
        httpSslCaDirPath: string,
        projectEntity: ProjectEntity,
        private lifecycleContextService: LifecycleContextService
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
        await this.proxySettingService.load();

        ipc.subscribe("addAutoResponderEntryEntities", async (event: any, filePaths: string[]): Promise<
            AutoResponderEntryEntityJSON[]
        > => {
            let filePromises = filePaths.map(path =>
                this.lifecycleContextService.autoResponderEntryFactory.createFromPath(path)
            );
            let autoResponderEntryEntities = await Promise.all(filePromises);
            await this.lifecycleContextService.autoResponderEntryRepository.storeList(autoResponderEntryEntities);
            return autoResponderEntryEntities.map((autoResponderEntryEntity: AutoResponderEntryEntity) => autoResponderEntryEntity.json);
        });
        ipc.subscribe("setNewCertificateStatus", (): Promise<CertificateStatus> => {
            return this.certificateService.getNewStatus();
        });
        ipc.subscribe("setNewProxySettingStatus", (): Promise<ProxySettingStatus> => {
            return this.proxySettingService.getNewStatus();
        });
        ipc.subscribe("deleteAutoResponderEntryEntity", (event: any, id: number) => {
            let autoResponderEntryIdentity = new AutoResponderEntryIdentity(id);
            this.lifecycleContextService.autoResponderEntryRepository.deleteByIdentity(autoResponderEntryIdentity);
        });
    }

    start(callback: (clientRequestEntity: ClientRequestEntity) => void) {
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
}
