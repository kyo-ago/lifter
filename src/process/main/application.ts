import {OutgoingHttpHeaders} from "http";
import {AutoResponderEntryEntityJSON} from "../../domains/proxy/auto-responder-entry/auto-responder-entry-entity";
import {ProxySettingStatus} from "../../domains/settings/proxy-setting/proxy-setting-entity";
import {ipc} from "../../libs/ipc";
import {HTTP_SSL_CA_DIR_PATH} from "../../settings";
import {CertificateService, CertificateStatus} from "./certificate/certificate-service";
import {LifecycleContextService} from "./lifecycle-context-service";
import {ProxyService} from "./proxy/proxy-service";
import {WindowManagerService} from "./window-manager/window-manager-service";

export class Application {
    private proxyService: ProxyService;
    private windowManagerService: WindowManagerService;
    private certificateService: CertificateService;

    constructor(
        private lifecycleContextService: LifecycleContextService,
    ) {
        this.proxyService = new ProxyService(HTTP_SSL_CA_DIR_PATH);
        this.windowManagerService = new WindowManagerService(
            this.lifecycleContextService.rewriteRuleFactory,
            this.lifecycleContextService.rewriteRuleRepository,
            this.lifecycleContextService.proxyBypassDomainFactory,
            this.lifecycleContextService.proxyBypassDomainRepository,
        );

        this.certificateService = new CertificateService(HTTP_SSL_CA_DIR_PATH);
    }

    async load() {
        await this.lifecycleContextService.load();
        this.windowManagerService.load();
        ipc.on('addAutoResponderEntryEntities', async (filePaths: string[]): Promise<AutoResponderEntryEntityJSON[]> => {
            let filePromises = filePaths.map((path) => this.lifecycleContextService.autoResponderEntryFactory.createFromPath(path));
            let autoResponderEntryEntities = await Promise.all(filePromises);
            this.lifecycleContextService.autoResponderEntryRepository.storeList(autoResponderEntryEntities);
            return autoResponderEntryEntities.map((autoResponderEntryEntity) => autoResponderEntryEntity.json);
        });
        ipc.on('setNewCertificateStatus', (): Promise<CertificateStatus> => {
            return this.certificateService.getNewStatus();
        });
        ipc.on('setNewProxySettingStatus', (): Promise<ProxySettingStatus> => {
            let proxySettingEntity = this.lifecycleContextService.proxySettingRepository.getProxySetting();
            return proxySettingEntity.getNewStatus();
        });
        ipc.on(
            'openProxyBypassDomainSettingWindow',
            () => this.windowManagerService.openProxyBypassDomainSettingWindow()
        );
        ipc.on(
            'openRewriteRuleSettingWindow',
            () => this.windowManagerService.openRewriteRuleSettingWindow()
        );
    }

    start() {
        this.proxyService.createServer((
            href: string,
            successCallback: (header: OutgoingHttpHeaders, body: Buffer | string) => void,
            errorCallback: (error: Error | undefined) => void,
        ) => {

        });
    }

    createWindow() {
        this.windowManagerService.createWindow();
    }

    stopProxy(): Promise<void> {
        let proxySettingEntity = this.lifecycleContextService.proxySettingRepository.getProxySetting();
        return proxySettingEntity.clearProxyState();
    }
}
