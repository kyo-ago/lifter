import {
    AutoResponderEntryEntityJSON, CertificateStatus, ClientRequestEntityJSON,
    ProxySettingStatus
} from "@lifter/lifter-common";
import {AbstractAutoResponderEntryEntity} from "@lifter/lifter-main/build/domains/proxy/auto-responder-entry/auto-responder-entry-entity";
import {AutoResponderEntryFactory} from "@lifter/lifter-main/build/domains/proxy/auto-responder-entry/lifecycle/auto-responder-entry-factory";
import {ClientRequestEntity} from "@lifter/lifter-main/build/domains/proxy/client-request/client-request-entity";
import {ClientRequestFactory} from "@lifter/lifter-main/build/domains/proxy/client-request/lifecycle/client-request-factory";
import {ipc} from "../../libs/ipc";
import {windowManager} from "./libs/get-window-manager";

export class Application {
    getCurrentState() {
        let json = windowManager.sharedData.fetch("mainApps");
        windowManager.sharedData.set("mainApps", {} as any);
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
        let jsons = await ipc.publish("addAutoResponderEntryEntities", paths);
        return jsons.map(json => AutoResponderEntryFactory.fromJSON(json));
    }

    async selectDialogEntry(fileNames: string[]): Promise<AbstractAutoResponderEntryEntity[]> {
        let jsons = await ipc.publish("addAutoResponderEntryEntities", fileNames);
        return jsons.map(json => AutoResponderEntryFactory.fromJSON(json));
    }

    async fetchAutoResponderEntities(): Promise<AbstractAutoResponderEntryEntity[]> {
        let jsons = await ipc.publish("fetchAutoResponderEntryEntities");
        return jsons.map(json => AutoResponderEntryFactory.fromJSON(json));
    }

    async deleteAutoResponderEntities(autoResponderEntryEntities: AbstractAutoResponderEntryEntity[]): Promise<void> {
        await ipc.publish("deleteAutoResponderEntryEntities", autoResponderEntryEntities.map((entity) => entity.id))
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

    setOnFileDropEvent(
        global: Window,
        dragenter: () => void,
        dragleave: () => void,
        drop: (files: File[]) => void,
    ) {
        global.addEventListener("dragover", e => e.preventDefault());
        global.addEventListener("dragenter", dragenter);
        global.addEventListener("dragleave", (event) => {
            if (event.clientX && event.clientY && event.offsetX && event.offsetY) {
                return;
            }
            dragleave();
        });
        global.addEventListener("drop", (event) => {
            event.preventDefault();
            if (!event.dataTransfer || !event.dataTransfer.files.length) {
                dragleave();
                return;
            }
            drop(Array.from(event.dataTransfer.files));
            dragleave();
        });
    }
}
