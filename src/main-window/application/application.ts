import * as Path from 'path';
import {AutoResponderEntryRepository} from '../domain/auto-responder-entry/auto-responder-entry-repositoty';
import {ClientRequestEntity} from '../domain/client-request/client-request-entity';
import {ProjectEntity} from '../domain/project/project-entity';
import {ProjectFactory} from '../domain/project/project-factory';
import {HTTP_SSL_CA_DIR_PATH} from '../domain/settings';
import {ipcRendererHandler} from '../libs/ipc-renderer-handler';
import {StateToProps} from '../ui/reducer';
import {AutoResponderService} from './auto-responder/auto-responder-service';
import {CertificateService, CertificateStatus} from './certificate/certificate-service';
import {ContextMenuService} from './context-menu/context-menu-service';
import {LifecycleContextService} from './lifecycle-context/lifecycle-context-service';
import {ProxySettingService, ProxySettingStatus} from './proxy-setting/proxy-setting-service';
import {ProxyService} from './proxy/proxy-service';

export class Application {
    private projectEntity: ProjectEntity;
    private autoResponderService: AutoResponderService;
    private certificateService: CertificateService;
    private proxyService: ProxyService;
    private proxySettingService: ProxySettingService;
    private contextMenuService: ContextMenuService;

    constructor(
        private userDataPath: string,
        private lifecycleContextService: LifecycleContextService,
        private projectFactory = new ProjectFactory(),
    ) {
        this.projectEntity = this.projectFactory.create();
        let autoResponderEntryFactory = this.projectFactory.createAutoResponderEntryFactory(
            this.projectEntity.getIdentity()
        );

        this.autoResponderService = new AutoResponderService(
            autoResponderEntryFactory,
            this.lifecycleContextService.autoResponderEntryRepository,
        );

        this.certificateService = new CertificateService(this.userDataPath);

        this.proxyService = new ProxyService(
            new AutoResponderEntryRepository(),
            this.lifecycleContextService.clientRequestRepository,
            Path.join(this.userDataPath, HTTP_SSL_CA_DIR_PATH)
        );

        this.proxySettingService = new ProxySettingService();

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
        return this.proxySettingService.getNewStatus().then((status) => {
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

    getRender(): Promise<StateToProps> {
        return new Promise((resolve, reject) => {
            Promise.all([
                this.certificateService.getCurrentStatus(),
                this.proxySettingService.getCurrentStatus(),
            ]).then(([certificateState, proxySettingStatus]: [CertificateStatus, ProxySettingStatus]) => {
                resolve({
                    autoResponderEntries: this.lifecycleContextService.autoResponderEntryRepository.resolveAll(),
                    clientRequestEntries: [...this.lifecycleContextService.clientRequestRepository.resolveAll()].reverse(),
                    certificateState: certificateState,
                    proxySettingStatus: proxySettingStatus,
                });
            });
        });
    }

    initialize(global: Window) {
        global.addEventListener("dragover", (e) => e.preventDefault());
        global.addEventListener("dragleave", (e) => e.preventDefault());
        global.addEventListener("drop", (e) => e.preventDefault());
        global.document.body.addEventListener("dragend", (e) => e.preventDefault());

        this.proxyService.createServer();

        this.contextMenuService.initialize(global);

        ipcRendererHandler.on("getAllRewriteRules", () => {
            let allRewriteRules = this.lifecycleContextService.rewriteRuleRepository.resolveAll().map((entity) => entity.json);
            ipcRendererHandler.send("responseAllRewriteRules", allRewriteRules);
        });
    }
}
