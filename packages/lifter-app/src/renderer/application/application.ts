import {
    AutoResponderEntityJSON,
    ClientRequestEntityJSON,
    CreateRewriteRuleModifierEntityJSON,
    ProxyBypassDomainEntityJSON,
    ProxySettingStatus,
    RewriteRuleEntityJSON,
    RewriteRuleModifierEntityJSON,
} from "@lifter/lifter-common";
import {
    ChangeCertificateStatusParam,
    ChangeProxyCommandGrantStatusParam,
    ipc,
} from "../../lib/ipc";
import { ApplicationMainStateJSON } from "../../main/application-main-state";
import { ContextMenuService } from "./context-menu/context-menu-service";
import { windowManager } from "./libs/get-window-manager";

export class Application {
    constructor(public contextMenuService = new ContextMenuService()) {}

    load(): void {
        this.contextMenuService.bind();
    }

    getCurrentState(): ApplicationMainStateJSON {
        let json = windowManager.sharedData.fetch("mainApps");
        windowManager.sharedData.set("mainApps", <any>{});
        return json;
    }

    async addDropFiles(files: File[]): Promise<AutoResponderEntityJSON[]> {
        let paths = files.map(file => (<any>file).path);
        return await ipc.publish("addAutoResponderEntities", paths);
    }

    async selectDialogEntry(
        fileNames: string[],
    ): Promise<AutoResponderEntityJSON[]> {
        return await ipc.publish("addAutoResponderEntities", fileNames);
    }

    async fetchAutoResponderEntities(): Promise<AutoResponderEntityJSON[]> {
        return await ipc.publish("fetchAutoResponderEntities");
    }

    async deleteAutoResponderEntities(
        autoResponderEntities: AutoResponderEntityJSON[],
    ): Promise<void> {
        await ipc.publish(
            "deleteAutoResponderEntities",
            autoResponderEntities.map(entity => entity.id),
        );
    }

    changeCertificateStatus(): Promise<ChangeCertificateStatusParam> {
        return ipc.publish("changeCertificateStatus");
    }

    onChangeCertificateStatus(
        callback: (param: ChangeCertificateStatusParam) => void,
    ) {
        ipc.subscribe("onChangeCertificateStatus", (_, param) =>
            callback(param),
        );
    }

    changeProxySettingStatus(): Promise<ProxySettingStatus> {
        return ipc.publish("changeProxySettingStatus");
    }

    changeProxyCommandGrantStatus(): Promise<
        ChangeProxyCommandGrantStatusParam
    > {
        return ipc.publish("changeProxyCommandGrantStatus");
    }

    onChangeProxyCommandGrantStatus(
        callback: (param: ChangeProxyCommandGrantStatusParam) => void,
    ) {
        ipc.subscribe("onChangeProxyCommandGrantStatus", (_, param) =>
            callback(param),
        );
    }

    changeNoAutoEnableProxySetting(): Promise<boolean> {
        return ipc.publish("changeNoAutoEnableProxySetting");
    }

    changeNoPacFileProxySetting(): Promise<boolean> {
        return ipc.publish("changeNoPacFileProxySetting");
    }

    async getProxyBypassDomains(): Promise<ProxyBypassDomainEntityJSON[]> {
        return ipc.publish("getProxyBypassDomains");
    }

    async saveProxyBypassDomains(
        domains: ProxyBypassDomainEntityJSON[],
    ): Promise<void> {
        return ipc.publish("saveProxyBypassDomains", domains);
    }

    async getRewriteRules(): Promise<RewriteRuleEntityJSON[]> {
        return ipc.publish("getRewriteRules");
    }

    async addRewriteRule(url: string): Promise<RewriteRuleEntityJSON> {
        return ipc.publish("addRewriteRule", url);
    }

    async deleteRewriteRules(
        rewriteRules: RewriteRuleEntityJSON[],
    ): Promise<void> {
        await ipc.publish(
            "deleteRewriteRules",
            rewriteRules.map(entity => entity.id),
        );
    }

    async addRewriteRuleModifier(
        action: string,
        entityId: number,
        param: CreateRewriteRuleModifierEntityJSON,
    ): Promise<void> {
        await ipc.publish("addRewriteRuleModifier", {
            action,
            entityId,
            param,
        });
    }

    async deleteRewriteRuleModifiers(
        action: string,
        entityId: number,
        modifiers: RewriteRuleModifierEntityJSON[],
    ): Promise<void> {
        await ipc.publish("deleteRewriteRuleModifiers", {
            action,
            entityId,
            modifiers,
        });
    }

    onAddClientRequestEntity(
        callback: (clientRequestEntityJSON: ClientRequestEntityJSON) => void,
    ) {
        ipc.subscribe(
            "addClientRequestEntity",
            (_, clientRequestEntityJSON: ClientRequestEntityJSON) => {
                callback(clientRequestEntityJSON);
            },
        );
    }

    onFileDropEvent(
        global: Window,
        dragenter: () => void,
        dragleave: () => void,
        drop: (files: File[]) => void,
    ) {
        global.addEventListener("dragover", e => e.preventDefault());
        global.addEventListener("dragenter", (event) => {
            if (!event.dataTransfer || !event.dataTransfer.items.length) {
                return;
            }
            if (!Array.from(event.dataTransfer.items).find((item) => item.kind === "file")) {
                return;
            }
            dragenter();
        });
        global.addEventListener("dragleave", event => {
            if (
                event.clientX &&
                event.clientY &&
                event.offsetX &&
                event.offsetY
            ) {
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
