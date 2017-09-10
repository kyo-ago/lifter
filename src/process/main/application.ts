import {OutgoingHttpHeaders} from "http";
import {HTTP_SSL_CA_DIR_PATH} from "../../settings";
import {LifecycleContextService} from "./lifecycle-context-service";
import {ProxyService} from "./proxy/proxy-service";
import {WindowManagerService} from "./WindowManager/WindowManagerService";
import {ipcMain} from "electron";

export class Application {
    private proxyService: ProxyService;
    private windowManagerService: WindowManagerService;

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
    }

    async load() {
        await this.lifecycleContextService.load();
        this.windowManagerService.load();
        ipcMain.on('openProxyBypassDomainSettingWindow', () => this.windowManagerService.openProxyBypassDomainSettingWindow());
        ipcMain.on('openRewriteRuleSettingWindow', () => this.windowManagerService.openRewriteRuleSettingWindow());
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
