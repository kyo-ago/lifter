import {ipcRenderer, remote} from 'electron';
import * as Datastore from 'nedb';
import * as Path from 'path';
import {AutoResponderEntryFactory} from '../domain/auto-responder-entry/auto-responder-entry-factory';
import {AutoResponderEntryRepository} from '../domain/auto-responder-entry/auto-responder-entry-repositoty';
import {ClientRequestRepository} from '../domain/client-request/client-request-repository';
import {ProjectEntity} from '../domain/project/project-entity';
import {ProjectFactory} from '../domain/project/project-factory';
import {DATA_STORE_FILENAME} from '../domain/settings';
import AppActions from '../ui/actions/index';
import {ClientRequestBoxEntry} from '../ui/components/client-request-box';
import {AutoResponder} from './auto-responder/auto-responder';

export class Application {
    private projectEntity: ProjectEntity;
    private autoResponder: AutoResponder;

    constructor(
        private global: Window,
        private projectFactory = new ProjectFactory(),
    ) {
        this.projectEntity = this.projectFactory.create();
        let autoResponderEntryFactory = this.projectFactory.createAutoResponderEntryFactory(this.projectEntity.getIdentity());

        this.autoResponder = new AutoResponder(
            autoResponderEntryFactory,
            new AutoResponderEntryRepository(),
        );
    }

    bindEvents(dispatch: any) {
        if (!this.projectEntity) {
            throw new Error('missing project');
        }

        this.global.addEventListener("dragover", (e) => e.preventDefault());
        this.global.addEventListener("dragleave", (e) => e.preventDefault());
        this.global.addEventListener("drop", (e) => e.preventDefault());
        this.global.document.body.addEventListener("dragend", (e) => e.preventDefault());
        let userDataPath = ipcRenderer.sendSync('getUserDataPath');

        let datastore = new Datastore({
            filename: Path.join(userDataPath, DATA_STORE_FILENAME),
            autoload: true,
        });

        /**
         * AutoResponder
         */
        this.autoResponder.bind(this.global, () => {
            this.autoResponder.getAutoResponderBoxEntries();
            ///
        });

        /**
         * Proxy
         */
        let proxy = new Proxy(
            autoResponderService,
            clientRequestRepository,
            Path.join(userDataPath, HTTP_SSL_CA_DIR_PATH)
        );
        proxy.createServer();

        /**
         * CertificateService
         */
        let certificateService = new CertificateService(userDataPath);
        certificateService.getCurrentStatus().then((certificateBoxStatus: CertificateStatus) => {
            dispatch(AppActions.changeCirtificateStatus(certificateBoxStatus));
        });
        eventEmitter.addListener("clickCertificateStatus", () => {
            certificateService.getNewStatus().then((certificateBoxStatus: CertificateStatus) => {
                ipcRenderer.send("clickCertificateStatus", certificateBoxStatus);
                dispatch(AppActions.changeCirtificateStatus(certificateBoxStatus));
            });
        });
        ipcRenderer.on("clickCertificateStatus", () => {
            eventEmitter.emit("clickCertificateStatus");
        });

        /**
         * ProxySetting
         */
        let proxySetting = new ProxySetting();
        proxySetting.initialize().then((proxySettingStatus: ProxySettingStatus) => {
            dispatch(AppActions.changeProxySettingStatus(proxySettingStatus));
        });
        eventEmitter.addListener("clickProxySettingStatus", () => {
            proxySetting.click().then((proxySettingStatus: ProxySettingStatus) => {
                ipcRenderer.send("clickProxySettingStatus", proxySettingStatus);
                dispatch(AppActions.changeProxySettingStatus(proxySettingStatus));
            });
        });
        ipcRenderer.on("clickProxySettingStatus", () => {
            eventEmitter.emit("clickProxySettingStatus");
        });

        /**
         * ContextMenuService
         */
        let contextMenuService = new ContextMenuService();
        contextMenuService.setEvent(window);
        eventEmitter.addListener("contextmenuClientRequest", () => {
            contextMenuService.setEvent(window);
        });
    }
}
