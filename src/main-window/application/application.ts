import * as Path from "path";
import {ShareRewriteRuleEntityJSON} from "../../share/domain/share-rewrite-rule/share-rewrite-rule-entity";
import {ClientRequestEntity} from "../domain/client-request/client-request-entity";
import {HTTP_SSL_CA_DIR_PATH} from "../domain/settings";
import {ipcRendererHandler} from "../libs/ipc-renderer-handler";
import {StateToProps} from "../ui/reducer";
import {AutoResponderService} from "./auto-responder/auto-responder-service";
import {CertificateService} from "./certificate/certificate-service";
import {ContextMenuService} from "./context-menu/context-menu-service";
import {LifecycleContextService} from "./lifecycle-context/lifecycle-context-service";
import {ProxySettingService, ProxySettingStatus} from "./proxy-setting/proxy-setting-service";
import {ProxyService} from "./proxy/proxy-service";

export class Application {
    private autoResponderService: AutoResponderService;
    private certificateService: CertificateService;
    private proxyService: ProxyService;
    private proxySettingService: ProxySettingService;
    private contextMenuService: ContextMenuService;

    constructor(
        private userDataPath: string,
        private lifecycleContextService: LifecycleContextService,
    ) {
        this.autoResponderService = new AutoResponderService(
            this.lifecycleContextService.autoResponderEntryFactory,
            this.lifecycleContextService.autoResponderEntryRepository,
        );

        this.certificateService = new CertificateService(this.userDataPath);

        this.proxyService = new ProxyService(
            this.lifecycleContextService.autoResponderEntryRepository,
            this.lifecycleContextService.clientRequestRepository,
            this.lifecycleContextService.clientRequestFactory,
            Path.join(this.userDataPath, HTTP_SSL_CA_DIR_PATH)
        );

        this.proxySettingService = new ProxySettingService(
            this.lifecycleContextService.proxySettingRepository,
        );

        this.contextMenuService = new ContextMenuService();
    }

    load() {
        return this.lifecycleContextService.load();
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
        this.proxyService.onRequest(callback);
    }

    openRewriteRuleSettingWindow() {
        ipcRendererHandler.send("openRewriteRuleSettingWindow");
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

        this.proxyService.createServer();

        this.contextMenuService.initialize(global);

        ipcRendererHandler.on("getAllRewriteRules", (ipcRendererEvent: any) => {
            let allRewriteRules = this.lifecycleContextService.rewriteRuleRepository.resolveAll().map((entity) => entity.json);
            ipcRendererHandler.send("responseAllRewriteRules", allRewriteRules);
        });

        ipcRendererHandler.on("overwriteAllRewriteRules", (ipcRendererEvent, allRewriteRules: ShareRewriteRuleEntityJSON[]) => {
            let rewriteRules = allRewriteRules.map((rewriteRule) => this.lifecycleContextService.rewriteRuleFactory.fromJSON(rewriteRule));
            this.lifecycleContextService.rewriteRuleRepository.overwrite(rewriteRules);
        });
    }
}
