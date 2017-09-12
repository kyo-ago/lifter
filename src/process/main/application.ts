import {OutgoingHttpHeaders} from "http";
import {HTTP_SSL_CA_DIR_PATH} from "../../settings";
import {LifecycleContextService} from "./lifecycle-context-service";
import {ProxyService} from "./proxy/proxy-service";
import {WindowManagerService} from "./window-manager/window-manager-service";
import {ipcMain} from "electron";
import {CertificateService} from "./certificate/certificate-service";

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
        ipcMain.on('openProxyBypassDomainSettingWindow', () => this.windowManagerService.openProxyBypassDomainSettingWindow());
        ipcMain.on('openRewriteRuleSettingWindow', () => this.windowManagerService.openRewriteRuleSettingWindow());
        ipcMain.on('addDropFiles', (event: any) => {
        });
        ipcMain.on('selectDialogEntry', (event: any) => {
        });
        ipcMain.on('setNewCertificateStatus', async (event: any) => {
            let newStatus = await this.certificateService.getNewStatus();
            event.sender.send('updateCertificateStatus', newStatus);
        });
        ipcMain.on('setNewProxySettingStatus', (event: any) => {
        });
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
