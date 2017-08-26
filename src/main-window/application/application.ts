import {remote} from "electron";
import {EventEmitter2} from "eventemitter2";
import * as Path from "path";
import {ShareRewriteRuleEntityJSON} from "../../share/domain/share-rewrite-rule/share-rewrite-rule-entity";
import {ClientRequestEntity} from "../domain/client-request/client-request-entity";
import {HTTP_SSL_CA_DIR_PATH} from "../domain/settings";
import {ipcRendererHandler} from "../libs/ipc-renderer-handler";
import {StateToProps} from "../ui/reducer";
import {AutoResponderService} from "./auto-responder/auto-responder-service";
import {CertificateService} from "./certificate/certificate-service";
import {ConnectionService} from "./connection-service/connection-service";
import {ContextMenuService} from "./context-menu/context-menu-service";
import {LifecycleContextService} from "./lifecycle-context/lifecycle-context-service";
import {ProxySettingService, ProxySettingStatus} from "./proxy-setting/proxy-setting-service";
import {ProxyService} from "./proxy/proxy-service";

const windowManager = remote.require('@kyo-ago/electron-window-manager');

export class Application {
    private eventEmitter = new EventEmitter2();

    private autoResponderService: AutoResponderService;
    private certificateService: CertificateService;
    private proxyService: ProxyService;
    private proxySettingService: ProxySettingService;
    private connectionService: ConnectionService;
    private contextMenuService: ContextMenuService;

    public isContentRendering = false;

    constructor(
        private userDataPath: string,
        private lifecycleContextService: LifecycleContextService,
    ) {
        this.autoResponderService = new AutoResponderService(
            this.lifecycleContextService.autoResponderEntryFactory,
            this.lifecycleContextService.autoResponderEntryRepository,
        );

        this.certificateService = new CertificateService(this.userDataPath);

        this.proxyService = new ProxyService(Path.join(this.userDataPath, HTTP_SSL_CA_DIR_PATH));

        this.proxySettingService = new ProxySettingService(
            this.lifecycleContextService.proxySettingRepository,
        );

        this.connectionService = new ConnectionService(
            this.lifecycleContextService.clientRequestRepository,
            this.lifecycleContextService.autoResponderEntryRepository,
            this.lifecycleContextService.rewriteRuleRepository,
        );

        this.contextMenuService = new ContextMenuService();
    }

    fileDrop(files: File[]) {
        return this.autoResponderService.addFiles(files);
    }

    selectDialogEntry(fileNames: string[]) {
        return this.autoResponderService.addPaths(fileNames);
    }

    clickCertificateStatus() {
        return this.certificateService.getNewStatus().then((status) => {
            ipcRendererHandler.send("clickCertificateStatus", status);
            return status;
        });
    }

    clickProxySettingStatus() {
        return this.proxySettingService.getNewStatus().then((status: ProxySettingStatus) => {
            ipcRendererHandler.send("clickProxySettingStatus", status);
            return status;
        });
    }

    contextmenuAutoResponderEntry(id: number) {
        this.contextMenuService.contextmenuAutoResponderEntry(id);
    }

    setOnProxyRequestEvent(callback: (clientRequestEntity: ClientRequestEntity) => void) {
        this.eventEmitter.addListener("onRequest", callback);
    }

    openRewriteRuleSettingWindow() {
        let allRewriteRules = this.lifecycleContextService.rewriteRuleRepository.resolveAll().map((entity) => entity.json);
        windowManager.sharedData.set('mainRewriteRules', allRewriteRules);
        windowManager.open(
            'rewriteRuleSettingWindow',
            'Rewrite rule setting',
            '/rewrite-rule-setting-window.html',
            'default',
            {
                file: 'rewrite-rule-setting-window-state.json',
                parent: windowManager.get('mainWindow'),
            }
        );
    }

    async getRender(): Promise<StateToProps> {
        return {
            autoResponderEntries: this.lifecycleContextService.autoResponderEntryRepository.resolveAll(),
            clientRequestEntries: [...this.lifecycleContextService.clientRequestRepository.resolveAll()].reverse(),
            certificateState: await this.certificateService.getCurrentStatus(),
            proxySettingStatus: await this.proxySettingService.getCurrentStatus(),
        };
    }

    initialize(global: Window) {
        global.addEventListener("dragover", (e) => e.preventDefault());
        global.addEventListener("dragleave", (e) => e.preventDefault());
        global.addEventListener("drop", (e) => e.preventDefault());
        global.document.body.addEventListener("dragend", (e) => e.preventDefault());

        this.proxyService.createServer((href: string, successCallback, errorCallback) => {
            let clientRequestEntity = this.lifecycleContextService.clientRequestFactory.create(href);
            this.eventEmitter.emit("onRequest", clientRequestEntity);
            this.connectionService.onRequest(clientRequestEntity, successCallback, errorCallback);
        });

        this.contextMenuService.initialize(global);

        windowManager.bridge.on('overwriteRewriteRules', (allRewriteRules: ShareRewriteRuleEntityJSON[]) => {
            let rewriteRules = allRewriteRules.map((rewriteRule) => this.lifecycleContextService.rewriteRuleFactory.fromJSON(rewriteRule));
            this.lifecycleContextService.rewriteRuleRepository.overwrite(rewriteRules);
        });
    }

    load() {
        return this.lifecycleContextService.load();
    }
}
