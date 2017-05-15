import * as Datastore from "nedb";
import * as React from "react";
import {connect} from "react-redux";
import {ipcRenderer, remote} from "electron";
import * as Path from "path";

import {AutoResponderBoxEntry} from "./auto-responder-box";
import AppActions from "../actions/index";
import {ClientRequestBoxEntry} from "./client-request-box";
import {WindowContent} from "./window-content";
import {ToolbarHeader} from "./toolbar-header";
import {eventEmitter} from "../../libs/event-emitter";
import {CertificateService, CertificateStatus} from "../../application/certificate/certificate-service";
import {ProxySetting, ProxySettingStatus} from "../../application/proxy-setting/proxy-setting";
import {AutoResponderService} from "../../domain/auto-responder-entry/auto-responder-entry-service";
import {ClientRequestRepository} from "../../domain/client-request/client-request-repository";
import {Proxy} from "../../application/proxy/proxy";
import {DATA_STORE_FILENAME, HTTP_SSL_CA_DIR_PATH} from "../../domain/settings";
import {ContextMenuService} from "../../domain/context-menu/context-menu-service";
import {AutoResponderSettingFileEntity} from "../../domain/auto-responder-entry/setting-file/auto-responder-entry-setting-file-entity";
import {Application} from "../../application/application";

class App extends React.Component<any, any> {
    render() {
        return <div className="window">
            <ToolbarHeader {...this.props} />
            <WindowContent {...this.props} />
        </div>;
    }
}

function mapStateToProps(state: any) {
    return state;
}

function mapDispatchToProps(dispatch: any) {
    let application = new Application(window);
    application.createProject();
    application.bindEvents(dispatch);

    window.addEventListener("dragover", (e) => e.preventDefault());
    window.addEventListener("dragleave", (e) => e.preventDefault());
    window.addEventListener("drop", (e) => e.preventDefault());
    window.document.body.addEventListener("dragend", (e) => e.preventDefault());
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
    window.addEventListener("drop", (e) => {
        if (!e.dataTransfer || !e.dataTransfer.files.length) {
            return;
        }
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

    return {};
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(App);