import {OutgoingHttpHeaders} from 'http';
import {Url} from "url";
import {NetworksetupProxyService} from "../../domains/settings/networksetup-proxy-service/networksetup-proxy-service";
import {UserSettingStorage} from "../../domains/libs/user-setting-storage";
import {AutoResponderEntryEntityJSON} from '../../domains/proxy/auto-responder-entry/auto-responder-entry-entity';
import {AutoResponderEntryIdentity} from "../../domains/proxy/auto-responder-entry/auto-responder-entry-identity";
import {PacFileService} from "../../domains/proxy/pac-file/pac-file-service";
import {ProjectEntity} from "../../domains/proxy/project/project-entity";
import {ProxyBypassDomainService} from "../../domains/settings/proxy-bypass-domain/proxy-bypass-domain-service";
import {ProxySettingService, ProxySettingStatus} from '../../domains/settings/proxy-setting/proxy-setting-service';
import {ipc} from '../../libs/ipc';
import {HTTP_SSL_CA_DIR_PATH} from '../../settings';
import {CertificateService, CertificateStatus} from './certificate/certificate-service';
import {ConnectionService} from './connection/connection-service';
import {LifecycleContextService} from './lifecycle-context-service';
import {ProxyService} from './proxy/proxy-service';
import {WindowManagerService} from './window-manager/window-manager-service';

export class Application {
    private userSettingStorage: UserSettingStorage;
    private networksetupProxyService: NetworksetupProxyService;
    private proxyService: ProxyService;
    private certificateService: CertificateService;
    private proxySettingService: ProxySettingService;
    private pacFileService: PacFileService;
    private connectionService: ConnectionService;
    private proxyBypassDomainService: ProxyBypassDomainService;
    private windowManagerService: WindowManagerService;

    constructor(
        private projectEntity: ProjectEntity,
        private lifecycleContextService: LifecycleContextService,
    ) {
        this.userSettingStorage = new UserSettingStorage(projectEntity);
        this.networksetupProxyService = new NetworksetupProxyService(this.userSettingStorage);
        this.proxyService = new ProxyService(HTTP_SSL_CA_DIR_PATH);
        this.certificateService = new CertificateService(HTTP_SSL_CA_DIR_PATH);
        this.proxySettingService = new ProxySettingService(
            this.networksetupProxyService,
            this.lifecycleContextService.networkInterfaceRepository,
        );
        this.pacFileService = new PacFileService(
            this.lifecycleContextService.autoResponderEntryRepository,
            this.networksetupProxyService,
            this.lifecycleContextService.networkInterfaceRepository,
        );
        this.connectionService = new ConnectionService(
            this.pacFileService,
            this.lifecycleContextService.autoResponderEntryRepository,
            this.lifecycleContextService.clientRequestRepository,
            this.lifecycleContextService.rewriteRuleRepository,
        );
        this.proxyBypassDomainService = new ProxyBypassDomainService(
            this.lifecycleContextService.proxyBypassDomainRepository,
            this.networksetupProxyService,
            this.lifecycleContextService.networkInterfaceRepository,
        );
        this.windowManagerService = new WindowManagerService(
            this.lifecycleContextService.autoResponderEntryRepository,
            this.lifecycleContextService.clientRequestRepository,
            this.lifecycleContextService.rewriteRuleRepository,
            this.proxyBypassDomainService,
            this.certificateService,
            this.proxySettingService,
        );
    }

    async load() {
        await Promise.all([
            this.userSettingStorage.load(),
            this.lifecycleContextService.load(),
            this.windowManagerService.load(),
        ]);
        await this.proxyBypassDomainService.load();
        await this.pacFileService.load();
        await this.networksetupProxyService.load();

        ipc.subscribe('addAutoResponderEntryEntities', async (event: any, filePaths: string[]): Promise<AutoResponderEntryEntityJSON[]> => {
            let filePromises = filePaths.map((path) => this.lifecycleContextService.autoResponderEntryFactory.createFromPath(path));
            let autoResponderEntryEntities = await Promise.all(filePromises);
            await this.lifecycleContextService.autoResponderEntryRepository.storeList(autoResponderEntryEntities);
            return autoResponderEntryEntities.map((autoResponderEntryEntity) => autoResponderEntryEntity.json);
        });
        ipc.subscribe('setNewCertificateStatus', (): Promise<CertificateStatus> => {
            return this.certificateService.getNewStatus();
        });
        ipc.subscribe('setNewProxySettingStatus', (): Promise<ProxySettingStatus> => {
            return this.proxySettingService.getNewStatus();
        });
        ipc.subscribe('deleteAutoResponderEntryEntity', (event: any, id: number) => {
            let autoResponderEntryIdentity = new AutoResponderEntryIdentity(id);
            this.lifecycleContextService.autoResponderEntryRepository.deleteByIdentity(autoResponderEntryIdentity);
        });
        ipc.subscribe(
            'openProxyBypassDomainSettingWindow',
            () => {
                this.windowManagerService.openProxyBypassDomainSettingWindow();
            },
        );
        ipc.subscribe(
            'openRewriteRuleSettingWindow',
            () => {
                this.windowManagerService.openRewriteRuleSettingWindow();
            },
        );
    }

    start() {
        this.proxyService.createServer((
            url: Url,
            blockCallback: (header: OutgoingHttpHeaders, body: Buffer | string) => void,
            passCallback: (error: Error | undefined) => void,
        ) => {
            let clientRequestEntity = this.lifecycleContextService.clientRequestFactory.create(url);
            ipc.publish('addClientRequestEntity', clientRequestEntity.json);
            this.connectionService.onRequest(clientRequestEntity, blockCallback, passCallback);
        });
    }

    createMainWindow() {
        return this.windowManagerService.createMainWindow();
    }

    async quit(): Promise<void> {
        await Promise.all([
            this.pacFileService.clearAutoProxyUrl(),
            this.proxySettingService.clearProxyState(),
        ]);
    }
}
