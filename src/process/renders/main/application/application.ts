import {ipcRenderer} from "electron";
import {EventEmitter2} from 'eventemitter2';
import {ClientRequestEntity} from '../../../../domains/proxy/client-request/client-request-entity';
import {HTTP_SSL_CA_DIR_PATH} from '../../../../settings';
import {StateToProps} from '../ui/reducer';
import {AutoResponderService} from './auto-responder/auto-responder-service';
import {CertificateService} from './certificate/certificate-service';
import {ConnectionService} from './connection-service/connection-service';
import {ContextMenuService} from './context-menu/context-menu-service';
import {LifecycleContextService} from './lifecycle-context/lifecycle-context-service';

export class Application {
    private eventEmitter = new EventEmitter2();

    private autoResponderService: AutoResponderService;
    private certificateService: CertificateService;
    private connectionService: ConnectionService;
    private contextMenuService: ContextMenuService;

    public isContentRendering = false;

    constructor(
        private lifecycleContextService: LifecycleContextService,
    ) {
        this.autoResponderService = new AutoResponderService(
            this.lifecycleContextService.autoResponderEntryFactory,
            this.lifecycleContextService.autoResponderEntryRepository,
        );

        this.certificateService = new CertificateService(HTTP_SSL_CA_DIR_PATH);

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

    async clickCertificateStatus() {
        let status = await this.certificateService.getNewStatus();
        return status;
    }

    async clickProxySettingStatus() {
        let status = await this.lifecycleContextService.proxySettingRepository.getProxySetting().getNewStatus();
        return status;
    }

    contextmenuAutoResponderEntry(id: number) {
        this.contextMenuService.contextmenuAutoResponderEntry(id);
    }

    setOnProxyRequestEvent(callback: (clientRequestEntity: ClientRequestEntity) => void) {
        this.eventEmitter.addListener("onRequest", callback);
    }

    openRewriteRuleSettingWindow() {
        ipcRenderer.send('openRewriteRuleSettingWindow');
    }

    openProxyBypassDomainSettingWindow() {
        ipcRenderer.send('openProxyBypassDomainSettingWindow');
    }

    async getRender(): Promise<StateToProps> {
        return {
            autoResponderEntries: this.lifecycleContextService.autoResponderEntryRepository.resolveAll(),
            clientRequestEntries: [...this.lifecycleContextService.clientRequestRepository.resolveAll()].reverse(),
            certificateState: await this.certificateService.getCurrentStatus(),
            proxySettingStatus: await this.lifecycleContextService.proxySettingRepository.getProxySetting().getCurrentStatus(),
        };
    }

    initialize(global: Window) {
        global.addEventListener("dragover", (e) => e.preventDefault());
        global.addEventListener("dragleave", (e) => e.preventDefault());
        global.addEventListener("drop", (e) => e.preventDefault());
        global.document.body.addEventListener("dragend", (e) => e.preventDefault());

        this.contextMenuService.initialize(global);
    }
}
