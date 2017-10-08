import {
    AbstractAutoResponderEntryEntity,
    AutoResponderEntryEntityJSON
} from '../../../../domains/proxy/auto-responder-entry/auto-responder-entry-entity';
import {AutoResponderEntryFactory} from '../../../../domains/proxy/auto-responder-entry/lifecycle/auto-responder-entry-factory';
import {
    ClientRequestEntity,
    ClientRequestEntityJSON
} from '../../../../domains/proxy/client-request/client-request-entity';
import {ClientRequestFactory} from '../../../../domains/proxy/client-request/lifecycle/client-request-factory';
import {ProxySettingStatus} from '../../../../domains/settings/proxy-setting/proxy-setting-entity';
import {ipc} from '../../../../libs/ipc';
import {CertificateStatus} from '../../../main/certificate/certificate-service';
import {StateToProps} from '../ui/reducer';
import {ContextMenuService} from './context-menu/context-menu-service';

export class Application {
    public isContentRendering = false;
    private contextMenuService = new ContextMenuService();

    JSONToPreloadedState(json: any): StateToProps {
        return {
            autoResponderEntries: json.autoResponderEntries.map((json: any) => AutoResponderEntryFactory.fromJSON(json)),
            clientRequestEntries: json.clientRequestEntries.map((json: any) => ClientRequestFactory.fromJSON(json)),
            certificateState: json.certificateState,
            proxySettingStatus: json.proxySettingStatus,
        };
    }

    async addDropFiles(files: File[]): Promise<AbstractAutoResponderEntryEntity[]> {
        let paths = files.map((file) => (<any>file).path);
        let jsons: AutoResponderEntryEntityJSON[] = await ipc.publish("addAutoResponderEntryEntities", paths);
        return jsons.map((json) => AutoResponderEntryFactory.fromJSON(json));
    }

    async selectDialogEntry(fileNames: string[]): Promise<AbstractAutoResponderEntryEntity[]> {
        let jsons: AutoResponderEntryEntityJSON[] = await ipc.publish("addAutoResponderEntryEntities", fileNames);
        return jsons.map((json) => AutoResponderEntryFactory.fromJSON(json));
    }

    clickCertificateStatus(): Promise<CertificateStatus> {
        return ipc.publish("setNewCertificateStatus");
    }

    clickProxySettingStatus(): Promise<ProxySettingStatus> {
        return ipc.publish("setNewProxySettingStatus");
    }

    contextmenuAutoResponderEntry(id: number) {
        this.contextMenuService.contextmenuAutoResponderEntry(id);
    }

    setOnUpdateClientRequestEntityEvent(callback: (clientRequestEntity: ClientRequestEntity) => void) {
        ipc.subscribe('addClientRequestEntity', (event, clientRequestEntityJSON: ClientRequestEntityJSON) => {
            callback(ClientRequestFactory.fromJSON(clientRequestEntityJSON));
        });
    }

    openRewriteRuleSettingWindow() {
        ipc.publish('openRewriteRuleSettingWindow');
    }

    openProxyBypassDomainSettingWindow() {
        ipc.publish('openProxyBypassDomainSettingWindow');
    }

    initialize(global: Window) {
        global.addEventListener("dragover", (e) => e.preventDefault());
        global.addEventListener("dragleave", (e) => e.preventDefault());
        global.addEventListener("drop", (e) => e.preventDefault());
        global.document.body.addEventListener("dragend", (e) => e.preventDefault());

        this.contextMenuService.initialize(global);
    }
}
