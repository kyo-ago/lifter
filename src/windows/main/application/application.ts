import {EventEmitter2} from 'eventemitter2';
import {ClientRequestEntity} from '../../../contexts/proxy/client-request/client-request-entity';
import {ProxyBypassDomainEntity} from "../../../contexts/proxy/proxy-bypass-domain/proxy-bypass-domain-entity";
import {RewriteRuleEntity} from "../../../contexts/proxy/rewrite-rule/rewrite-rule-entity";
import {ShareProxyBypassDomainEntityJSON} from '../../../contexts/share/share-proxy-bypass-domain/share-proxy-bypass-domain-entity';
import {ShareRewriteRuleEntityJSON} from '../../../contexts/share/share-rewrite-rule/share-rewrite-rule-entity';
import {HTTP_SSL_CA_DIR_PATH} from '../../../settings';
import {windowManager} from "../../libs/get-window-manager";
import {StateToProps} from '../ui/reducer';
import {AutoResponderService} from './auto-responder/auto-responder-service';
import {CertificateService} from './certificate/certificate-service';
import {ConnectionService} from './connection-service/connection-service';
import {ContextMenuService} from './context-menu/context-menu-service';
import {LifecycleContextService} from './lifecycle-context/lifecycle-context-service';
import {ProxySettingService} from './proxy-setting/proxy-setting-service';
import {ProxyService} from './proxy/proxy-service';

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
        private lifecycleContextService: LifecycleContextService,
    ) {
        this.autoResponderService = new AutoResponderService(
            this.lifecycleContextService.autoResponderEntryFactory,
            this.lifecycleContextService.autoResponderEntryRepository,
        );

        this.certificateService = new CertificateService(HTTP_SSL_CA_DIR_PATH);

        this.proxyService = new ProxyService(HTTP_SSL_CA_DIR_PATH);

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

    async clickCertificateStatus() {
        let status = await this.certificateService.getNewStatus();
        return status;
    }

    async clickProxySettingStatus() {
        let status = await this.proxySettingService.getNewStatus();
        return status;
    }

    contextmenuAutoResponderEntry(id: number) {
        this.contextMenuService.contextmenuAutoResponderEntry(id);
    }

    setOnProxyRequestEvent(callback: (clientRequestEntity: ClientRequestEntity) => void) {
        this.eventEmitter.addListener("onRequest", callback);
    }

    openRewriteRuleSettingWindow() {
        let allRewriteRules = this.lifecycleContextService
            .rewriteRuleRepository
            .resolveAll()
            .map((entity: RewriteRuleEntity) => entity.json)
        ;

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

    openProxyBypassDomainSettingWindow() {
        let allEntities = this.lifecycleContextService
            .proxyBypassDomainRepository
            .resolveAll()
            .map((entity: ProxyBypassDomainEntity) => entity.json)
        ;
        windowManager.sharedData.set('mainProxyBypassDomains', allEntities);
        windowManager.open(
            'proxyBypassDomainSettingWindow',
            'Proxy bypass domain setting',
            '/proxy-bypass-domain-setting-window.html',
            'default',
            {
                file: 'proxy-bypass-domain-setting-window-state.json',
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

        windowManager.bridge.on('overwriteRewriteRules', (allJsons: ShareRewriteRuleEntityJSON[]) => {
            let entities = allJsons.map((json) => this.lifecycleContextService.rewriteRuleFactory.fromJSON(json));
            this.lifecycleContextService.rewriteRuleRepository.overwriteAll(entities);
        });
        windowManager.bridge.on('overwriteProxyBypassDomains', (allJsons: ShareProxyBypassDomainEntityJSON[]) => {
            let entities = allJsons.map((json) => this.lifecycleContextService.proxyBypassDomainFactory.fromJSON(json));
            this.lifecycleContextService.proxyBypassDomainRepository.overwriteAll(entities);
        });
    }

    load() {
        return this.lifecycleContextService.load();
    }
}
