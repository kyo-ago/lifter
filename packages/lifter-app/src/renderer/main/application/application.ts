import {
    AutoResponderEntryEntityJSON,
    CertificateStatus,
    ClientRequestEntityJSON,
    ProxySettingStatus
} from "@kyo-ago/lifter-common";
import { AbstractAutoResponderEntryEntity } from "@kyo-ago/lifter-main/src/domains/proxy/auto-responder-entry/auto-responder-entry-entity";
import { AutoResponderEntryIdentity } from "@kyo-ago/lifter-main/src/domains/proxy/auto-responder-entry/auto-responder-entry-identity";
import { AutoResponderEntryFactory } from "@kyo-ago/lifter-main/src/domains/proxy/auto-responder-entry/lifecycle/auto-responder-entry-factory";
import { ClientRequestEntity } from "@kyo-ago/lifter-main/src/domains/proxy/client-request/client-request-entity";
import { ClientRequestFactory } from "@kyo-ago/lifter-main/src/domains/proxy/client-request/lifecycle/client-request-factory";
import { ipc } from "../../../libs/ipc";
import { StateToProps } from "../ui/reducer";
import { ContextMenuService } from "./context-menu/context-menu-service";

export class Application {
    public isContentRendering = false;
    private contextMenuService = new ContextMenuService();

    JSONToPreloadedState(json: any): StateToProps {
        return {
            autoResponderEntries: json.autoResponderEntries.map((json: any) =>
                AutoResponderEntryFactory.fromJSON(json)
            ),
            clientRequestEntries: json.clientRequestEntries.map((json: any) => ClientRequestFactory.fromJSON(json)),
            certificateState: json.certificateState,
            proxySettingStatus: json.proxySettingStatus
        };
    }

    async addDropFiles(files: File[]): Promise<AbstractAutoResponderEntryEntity[]> {
        let paths = files.map(file => (<any>file).path);
        let jsons: AutoResponderEntryEntityJSON[] = await ipc.publish("addAutoResponderEntryEntities", paths);
        return jsons.map(json => AutoResponderEntryFactory.fromJSON(json));
    }

    async selectDialogEntry(fileNames: string[]): Promise<AbstractAutoResponderEntryEntity[]> {
        let jsons: AutoResponderEntryEntityJSON[] = await ipc.publish("addAutoResponderEntryEntities", fileNames);
        return jsons.map(json => AutoResponderEntryFactory.fromJSON(json));
    }

    clickCertificateStatus(): Promise<CertificateStatus> {
        return ipc.publish("setNewCertificateStatus");
    }

    clickProxySettingStatus(): Promise<ProxySettingStatus> {
        return ipc.publish("setNewProxySettingStatus");
    }

    contextmenuAutoResponderEntry(autoResponderEntryIdentity: AutoResponderEntryIdentity) {
        this.contextMenuService.contextmenuAutoResponderEntry(() => {
            ipc.publish("deleteAutoResponderEntryEntity", autoResponderEntryIdentity.getValue());
        });
    }

    setOnUpdateClientRequestEntityEvent(callback: (clientRequestEntity: ClientRequestEntity) => void) {
        ipc.subscribe("addClientRequestEntity", (event, clientRequestEntityJSON: ClientRequestEntityJSON) => {
            callback(ClientRequestFactory.fromJSON(clientRequestEntityJSON));
        });
    }

    openRewriteRuleSettingWindow() {
        ipc.publish("openRewriteRuleSettingWindow");
    }

    openProxyBypassDomainSettingWindow() {
        ipc.publish("openProxyBypassDomainSettingWindow");
    }

    openPreferencesWindow() {
        ipc.publish("openPreferencesWindow");
    }

    initialize(global: Window) {
        global.addEventListener("dragover", e => e.preventDefault());
        global.addEventListener("dragleave", e => e.preventDefault());
        global.addEventListener("drop", e => e.preventDefault());
        global.document.body.addEventListener("dragend", e => e.preventDefault());

        this.contextMenuService.initialize(global);
    }
}
