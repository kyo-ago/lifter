import {
    AutoResponderEntryEntityJSON, CertificateStatus, ClientRequestEntityJSON,
    ProxySettingStatus
} from "@lifter/lifter-common";
import {AbstractAutoResponderEntryEntity} from "@lifter/lifter-main/build/domains/proxy/auto-responder-entry/auto-responder-entry-entity";
import {AutoResponderEntryFactory} from "@lifter/lifter-main/build/domains/proxy/auto-responder-entry/lifecycle/auto-responder-entry-factory";
import {ClientRequestEntity} from "@lifter/lifter-main/build/domains/proxy/client-request/client-request-entity";
import {ClientRequestFactory} from "@lifter/lifter-main/build/domains/proxy/client-request/lifecycle/client-request-factory";
import {ipc} from "../../libs/ipc";

export class Application {
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

    setOnUpdateClientRequestEntityEvent(callback: (clientRequestEntity: ClientRequestEntity) => void) {
        ipc.subscribe("addClientRequestEntity", (event, clientRequestEntityJSON: ClientRequestEntityJSON) => {
            callback(ClientRequestFactory.fromJSON(clientRequestEntityJSON));
        });
    }

    initialize(global: Window) {
        global.addEventListener("dragover", e => e.preventDefault());
        global.addEventListener("dragleave", e => e.preventDefault());
        global.addEventListener("drop", e => e.preventDefault());
        global.document.body.addEventListener("dragend", e => e.preventDefault());
    }
}
