import {OutgoingHttpHeaders} from 'http';
import {AutoResponderEntryEntityJSON} from '../../domains/proxy/auto-responder-entry/auto-responder-entry-entity';
import {AutoResponderEntryIdentity} from "../../domains/proxy/auto-responder-entry/auto-responder-entry-identity";
import {ProxyBypassDomainService} from "../../domains/settings/proxy-bypass-domain/proxy-bypass-domain-service";
import {ProxySettingStatus} from '../../domains/settings/proxy-setting/proxy-setting-entity';
import {ipc} from '../../libs/ipc';
import {HTTP_SSL_CA_DIR_PATH} from '../../settings';
import {CertificateService, CertificateStatus} from './certificate/certificate-service';
import {ConnectionService} from './connection/connection-service';
import {LifecycleContextService} from './lifecycle-context-service';
import {ProxyService} from './proxy/proxy-service';
import {WindowManagerService} from './window-manager/window-manager-service';

export class Application {
    private proxyService: ProxyService;
    private certificateService: CertificateService;
    private connectionService: ConnectionService;
    private proxyBypassDomainService: ProxyBypassDomainService;
    private windowManagerService: WindowManagerService;

    constructor(
        private lifecycleContextService: LifecycleContextService,
    ) {
        this.proxyService = new ProxyService(HTTP_SSL_CA_DIR_PATH);
        this.certificateService = new CertificateService(HTTP_SSL_CA_DIR_PATH);
        this.connectionService = new ConnectionService(
            this.lifecycleContextService.autoResponderEntryRepository,
            this.lifecycleContextService.clientRequestRepository,
            this.lifecycleContextService.rewriteRuleRepository,
        );
        this.proxyBypassDomainService = new ProxyBypassDomainService(
            this.lifecycleContextService.proxyBypassDomainRepository,
            this.lifecycleContextService.networkInterfaceRepository,
        );
        this.windowManagerService = new WindowManagerService(
            this.lifecycleContextService.autoResponderEntryRepository,
            this.lifecycleContextService.clientRequestRepository,
            this.lifecycleContextService.proxySettingRepository,
            this.lifecycleContextService.rewriteRuleRepository,
            this.proxyBypassDomainService,
            this.certificateService,
        );
    }

    async load() {
        await this.lifecycleContextService.load();
        await this.proxyBypassDomainService.load();
        await this.windowManagerService.load();

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
            let proxySettingEntity = this.lifecycleContextService.proxySettingRepository.getProxySetting();
            return proxySettingEntity.getNewStatus();
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
            href: string,
            blockCallback: (header: OutgoingHttpHeaders, body: Buffer | string) => void,
            passCallback: (error: Error | undefined) => void,
        ) => {
            let clientRequestEntity = this.lifecycleContextService.clientRequestFactory.create(href);
            ipc.publish('addClientRequestEntity', clientRequestEntity.json);
            this.connectionService.onRequest(clientRequestEntity, blockCallback, passCallback);
        });
    }

    createMainWindow() {
        return this.windowManagerService.createMainWindow();
    }

    stopProxy(): Promise<void> {
        let proxySettingEntity = this.lifecycleContextService.proxySettingRepository.getProxySetting();
        return proxySettingEntity.clearProxyState();
    }
}
