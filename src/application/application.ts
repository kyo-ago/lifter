import * as Path from "path";
import * as Datastore from "nedb";
import {ipcRenderer, remote} from "electron";
import {DATA_STORE_FILENAME} from "../domain/settings";
import {ProjectEntity} from "../domain/project/project-entity";
import {ProjectFactory} from "../domain/project/project-factory";
import {AutoResponderEntryFactory} from "../domain/auto-responder-entry/auto-responder-entry-factory";

export class Application {
    private projectEntity: ProjectEntity | null;
    private autoResponderEntryFactory: AutoResponderEntryFactory | null;

    constructor(private global: Window) {}

    createProject() {
        this.projectEntity = ProjectFactory.create();
        this.autoResponderEntryFactory = ProjectFactory.createAutoResponderEntryFactory();
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
         * AutoResponderService
         */
        let autoResponderService = new AutoResponderService(datastore);
        let subject = autoResponderService.createSubject();
        this.global.addEventListener("drop", (e) => {
            if (!e.dataTransfer || !e.dataTransfer.files.length) {
                return;
            }
            this.autoResponderEntryFactory
            subject.next(Array.from(e.dataTransfer.files));
        });
        ipcRenderer.on("addAutoResponderEntry", () => {
            remote.dialog.showOpenDialog(null, {
                properties: ['openDirectory', 'openFile', 'createDirectory'],
            }, (filePaths) => {
                autoResponderService.addAutoResponderEntryRepositoryPath(filePaths);
            });
        });
        autoResponderService.getObserver().subscribe((autoResponderBoxEntry: AutoResponderBoxEntry) => {
            dispatch(AppActions.fileDrop(autoResponderBoxEntry));
        });
        autoResponderService.loadFile().then((autoResponderSettingFileEntities: AutoResponderSettingFileEntity[]) => {
            return autoResponderSettingFileEntities
        });

        /**
         * ClientRequestRepository
         */
        let clientRequestRepository = new ClientRequestRepository();
        clientRequestRepository.observer.subscribe((clientRequestEntity: ClientRequestBoxEntry) => {
            dispatch(AppActions.clientRequest(clientRequestEntity));
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
