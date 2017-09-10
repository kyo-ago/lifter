import {ipcRenderer} from "electron";
import {AbstractAutoResponderEntryEntity} from "../../../../domains/proxy/auto-responder-entry/auto-responder-entry-entity";
import {
    ClientRequestEntity,
    ClientRequestEntityJSON
} from '../../../../domains/proxy/client-request/client-request-entity';
import {ProxySettingStatus} from "../../../../domains/settings/proxy-setting/proxy-setting-entity";
import {CertificateStatus} from '../../../main/certificate/certificate-service';
import {ContextMenuService} from './context-menu/context-menu-service';
import {ClientRequestFactory} from "../../../../domains/proxy/client-request/lifecycle/client-request-factory";

export class Application {
    public isContentRendering = false;
    private contextMenuService = new ContextMenuService();

    addDropFiles(files: File[]) {
        ipcRenderer.send("addDropFiles", files);
    }

    selectDialogEntry(fileNames: string[]) {
        ipcRenderer.send("selectDialogEntry", fileNames);
    }

    clickCertificateStatus() {
        ipcRenderer.send("setNewCertificateStatus");
    }

    clickProxySettingStatus() {
        ipcRenderer.send("setNewProxySettingStatus");
    }

    contextmenuAutoResponderEntry(id: number) {
        this.contextMenuService.contextmenuAutoResponderEntry(id);
    }

    setOnUpdateAutoResponderEntryEvent(callback: (autoResponderEntry: AbstractAutoResponderEntryEntity) => void) {
        ipcRenderer.on('addAutoResponderEntry', (autoResponderEntryJSON: any) => {
            callback(autoResponderEntryJSON);
        });
    }

    setOnUpdateClientRequestEntityEvent(callback: (clientRequestEntity: ClientRequestEntity) => void) {
        ipcRenderer.on('addClientRequestEntity', (clientRequestEntityJSON: ClientRequestEntityJSON) => {
            callback(ClientRequestFactory.fromJSON(clientRequestEntityJSON));
        });
    }

    setOnUpdateCertificateStatusEvent(callback: (certificateStatus: CertificateStatus) => void) {
            ipcRenderer.on('updateCertificateStatus', (certificateStatus: CertificateStatus) => {
                callback(certificateStatus);
            });
    }

    setOnUpdateProxySettingStatusEvent(callback: (proxySettingStatus: ProxySettingStatus) => void) {
        ipcRenderer.on('updateProxySettingStatus', (proxySettingStatus: ProxySettingStatus) => {
            callback(proxySettingStatus);
        });
    }

    openRewriteRuleSettingWindow() {
        ipcRenderer.send('openRewriteRuleSettingWindow');
    }

    openProxyBypassDomainSettingWindow() {
        ipcRenderer.send('openProxyBypassDomainSettingWindow');
    }

    initialize(global: Window) {
        global.addEventListener("dragover", (e) => e.preventDefault());
        global.addEventListener("dragleave", (e) => e.preventDefault());
        global.addEventListener("drop", (e) => e.preventDefault());
        global.document.body.addEventListener("dragend", (e) => e.preventDefault());

        this.contextMenuService.initialize(global);
    }
}
