import * as Path from "path";
import {AutoResponderEntryRepository} from "../domain/auto-responder-entry/auto-responder-entry-repositoty";
import {ProjectEntity} from "../domain/project/project-entity";
import {ProjectFactory} from "../domain/project/project-factory";
import {HTTP_SSL_CA_DIR_PATH} from "../domain/settings";
import AppActions from "../ui/actions/index";
import {AutoResponderService} from "./auto-responder/auto-responder-service";
import {CertificateService, CertificateStatus} from "./certificate/certificate-service";
import {ProxySettingService, ProxySettingStatus} from "./proxy-setting/proxy-setting-service";
import {ContextMenuService} from "./context-menu/context-menu-service";
import {ProxyService} from "./proxy/proxy-service";
import {ClientRequestRepository} from "../domain/client-request/client-request-repository";
import {ipcRendererHandler} from "../libs/ipc-renderer-handler";

export class Application {
    private projectEntity: ProjectEntity;
    private autoResponderService: AutoResponderService;

    constructor(
        private global: Window,
        private projectFactory = new ProjectFactory(),
    ) {
        this.projectEntity = this.projectFactory.create();
        let autoResponderEntryFactory = this.projectFactory.createAutoResponderEntryFactory(this.projectEntity.getIdentity());

        this.autoResponderService = new AutoResponderService(
            autoResponderEntryFactory,
            new AutoResponderEntryRepository(),
        );
    }

    bindEvents(dispatch: any) {
        this.global.addEventListener("dragover", (e) => e.preventDefault());
        this.global.addEventListener("dragleave", (e) => e.preventDefault());
        this.global.addEventListener("drop", (e) => e.preventDefault());
        this.global.document.body.addEventListener("dragend", (e) => e.preventDefault());
        let userDataPath = ipcRendererHandler.sendSync("getUserDataPath");

        /**
         * AutoResponderService
         */
        this.autoResponderService.bind(this.global, () => {
            this.autoResponderService.getAutoResponderBoxEntries();
            ///
        });

        /**
         * ProxyService
         */
        let proxyService = new ProxyService(
            new AutoResponderEntryRepository(),
            new ClientRequestRepository(),
            Path.join(userDataPath, HTTP_SSL_CA_DIR_PATH)
        );
        proxyService.createServer();

        /**
         * CertificateService
         */
        let certificateService = new CertificateService(userDataPath);
        let getCurrentCertificateStatus = () => {
            certificateService.getCurrentStatus().then((certificateBoxStatus: CertificateStatus) => {
                dispatch(AppActions.changeCirtificateStatus(certificateBoxStatus));
            });
        };
        certificateService.bind(getCurrentCertificateStatus);
        getCurrentCertificateStatus();

        /**
         * ProxySettingService
         */
        let proxySettingService = new ProxySettingService();
        let getCurrentProxySettingStatus = () => {
            proxySettingService.getCurrentStatus().then((proxySettingStatus: ProxySettingStatus) => {
                dispatch(AppActions.changeProxySettingStatus(proxySettingStatus));
            });
        };
        proxySettingService.bind(getCurrentProxySettingStatus);
        getCurrentProxySettingStatus();

        /**
         * ContextMenuService
         */
        let contextMenuService = new ContextMenuService();
        contextMenuService.bind(this.global);
    }
}
