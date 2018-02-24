import {
    ApplicationMainStateJSON,
    AutoResponderEntityJSON,
    CertificateStatus,
    ClientRequestEntityJSON,
    ipc,
    ProxyCommandGrantStatus,
    ProxySettingStatus,
} from "@lifter/lifter-common";
import { windowManager } from "./libs/get-window-manager";

export class Application {
    getCurrentState(): ApplicationMainStateJSON {
        let json = windowManager.sharedData.fetch("mainApps");
        windowManager.sharedData.set("mainApps", <any>{});
        return json;
    }

    async addDropFiles(files: File[]): Promise<AutoResponderEntityJSON[]> {
        let paths = files.map(file => (<any>file).path);
        return await ipc.publish("addAutoResponderEntities", paths);
    }

    async selectDialogEntry(fileNames: string[]): Promise<AutoResponderEntityJSON[]> {
        return await ipc.publish("addAutoResponderEntities", fileNames);
    }

    async fetchAutoResponderEntities(): Promise<AutoResponderEntityJSON[]> {
        return await ipc.publish("fetchAutoResponderEntities");
    }

    async deleteAutoResponderEntities(autoResponderEntities: AutoResponderEntityJSON[]): Promise<void> {
        await ipc.publish("deleteAutoResponderEntities", autoResponderEntities.map(entity => entity.id));
    }

    changeCertificateStatus(): Promise<CertificateStatus> {
        return ipc.publish("changeCertificateStatus");
    }

    changeProxySettingStatus(): Promise<ProxySettingStatus> {
        return ipc.publish("changeProxySettingStatus");
    }

    changeProxyCommandGrantStatus(): Promise<ProxyCommandGrantStatus> {
        return ipc.publish("changeProxyCommandGrantStatus");
    }

    changeNoAutoEnableProxySetting(): Promise<boolean> {
        return ipc.publish("changeNoAutoEnableProxySetting");
    }

    changeNoPacFileProxySetting(): Promise<boolean> {
        return ipc.publish("changeNoPacFileProxySetting");
    }

    setOnUpdateClientRequestEntityEvent(callback: (clientRequestEntityJSON: ClientRequestEntityJSON) => void) {
        ipc.subscribe("addClientRequestEntity", (event, clientRequestEntityJSON: ClientRequestEntityJSON) => {
            callback(clientRequestEntityJSON);
        });
    }

    setOnFileDropEvent(global: Window, dragenter: () => void, dragleave: () => void, drop: (files: File[]) => void) {
        global.addEventListener("dragover", e => e.preventDefault());
        global.addEventListener("dragenter", dragenter);
        global.addEventListener("dragleave", event => {
            if (event.clientX && event.clientY && event.offsetX && event.offsetY) {
                return;
            }
            dragleave();
        });
        global.addEventListener("drop", event => {
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
