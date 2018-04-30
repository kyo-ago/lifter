import * as windowManager from "@lifter/electron-window-manager";
import {
    APPLICATION_NAME,
    AutoResponderEntityJSON,
    CertificateStatus,
    ClientRequestEntityJSON,
    ProxyBypassDomainEntityJSON,
    ProxyCommandGrantStatus,
    ProxySettingStatus,
    RewriteRuleEntityJSON
} from "@lifter/lifter-common";
import { Application } from "@lifter/lifter-main";
import { addRewriteRuleModifierParam, deleteRewriteRuleModifierParam, ipc } from "../lib/ipc";
import { WINDOW_STATE_DIR, WindowManagerInit } from "../settings";

export interface ApplicationMainStateJSON {
    autoResponderEntries: AutoResponderEntityJSON[];
    clientRequestEntries: ClientRequestEntityJSON[];
    proxyBypassDomainEntries: ProxyBypassDomainEntityJSON[];
    rewriteRuleEntries: RewriteRuleEntityJSON[];
    certificateState: CertificateStatus;
    certificateCommands: string[];
    proxySettingStatus: ProxySettingStatus;
    proxyCommandGrantStatus: ProxyCommandGrantStatus;
    proxyCommandGrantCommands: string[];
    noAutoEnableProxySetting: boolean;
    noPacFileProxySetting: boolean;
}

export class WindowManager {
    constructor(private application: Application) {}

    async load() {
        windowManager.init(WindowManagerInit);

        ipc.subscribe("addAutoResponderEntities", (_, paths: string[]) => {
            return this.application.getAutoResponder().add(paths);
        });

        ipc.subscribe("fetchAutoResponderEntities", () => {
            return this.application.getAutoResponder().fetchAll();
        });

        ipc.subscribe("deleteAutoResponderEntities", (_, ids: number[]) => {
            return this.application.getAutoResponder().deletes(ids);
        });

        this.application.getClientRequestService().subscribe(clientRequestEntityJSON => {
            return ipc.publish("addClientRequestEntity", clientRequestEntityJSON);
        });

        ipc.subscribe("changeCertificateStatus", () => {
            return this.application.getCertificateService().changeCertificateStatus();
        });

        ipc.subscribe("changeProxySettingStatus", () => {
            return this.application.getProxySettingService().change();
        });

        ipc.subscribe("changeProxyCommandGrantStatus", () => {
            return this.application.getProxyCommandGrantService().changeStatus();
        });

        ipc.subscribe("changeNoAutoEnableProxySetting", () => {
            return this.application.getUserSetting().changeNoAutoEnableProxy();
        });

        ipc.subscribe("changeNoPacFileProxySetting", () => {
            return this.application.getUserSetting().changeNoPacFileProxy();
        });

        ipc.subscribe("getRewriteRules", () => {
            return this.application.getRewriteRules().fetchAll();
        });

        ipc.subscribe("addRewriteRule", (_, url: string) => {
            return this.application.getRewriteRules().addRule(url);
        });

        ipc.subscribe("changeRewriteRule", (_, rule: RewriteRuleEntityJSON) => {
            return this.application.getRewriteRules().changeRule(rule);
        });

        ipc.subscribe("deleteRewriteRules", (_, ids: number[]) => {
            return this.application.getRewriteRules().deleteRules(ids);
        });

        ipc.subscribe("addRewriteRuleModifier", (_, { action, entityId, param }: addRewriteRuleModifierParam) => {
            return this.application.getRewriteRules().addModifier(action, entityId, param);
        });

        ipc.subscribe(
            "deleteRewriteRuleModifiers",
            (_, { action, entityId, modifiers }: deleteRewriteRuleModifierParam) => {
                return this.application.getRewriteRules().deleteModifiers(action, entityId, modifiers);
            },
        );
    }

    async createMainWindow() {
        let name = "mainWindow";
        if (windowManager.get(name)) {
            return;
        }

        const isDevelopment = process.env.NODE_ENV !== "production";
        const url = isDevelopment
            ? `http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`
            : `file://${__dirname}/index.html`;

        // Promise.all is max 10 arguments (d.ts limit)
        let [
            autoResponderEntries,
            clientRequestEntries,
            proxyBypassDomainEntries,
            rewriteRuleEntries,
            certificateState,
        ] = await Promise.all([
            this.application.getAutoResponder().fetchAll(),
            this.application.getClientRequestService().fetchAll(),
            this.application.getProxyBypassDomains().fetchAll(),
            this.application.getRewriteRules().fetchAll(),
            this.application.getCertificateService().fetchCurrentStatus(),
        ]);
        let [
            certificateCommands,
            proxySettingStatus,
            proxyCommandGrantStatus,
            proxyCommandGrantCommands,
            noAutoEnableProxySetting,
            noPacFileProxySetting,
        ] = await Promise.all([
            this.application.getCertificateService().fetchCurrentCommands(),
            this.application.getProxySettingService().fetch(),
            this.application.getProxyCommandGrantService().fetchStatus(),
            this.application.getProxyCommandGrantService().fetchCommands(),
            this.application.getUserSetting().getNoAutoEnableProxy(),
            this.application.getUserSetting().getNoPacFileProxy(),
        ]);

        let state: ApplicationMainStateJSON = {
            autoResponderEntries,
            clientRequestEntries,
            proxyBypassDomainEntries,
            rewriteRuleEntries,
            certificateState,
            certificateCommands,
            proxySettingStatus,
            proxyCommandGrantStatus,
            proxyCommandGrantCommands,
            noAutoEnableProxySetting,
            noPacFileProxySetting,
        };
        windowManager.sharedData.set("mainApps", state);
        windowManager.open(name, APPLICATION_NAME, url, "default", {
            file: `${WINDOW_STATE_DIR}main-window-state.json`,
        });

        if (isDevelopment) {
            windowManager
                .get(name)
                .content()
                .openDevTools();
        }

        let window = windowManager.get(name);
        ipc.addWindow(window.object);
        window.object.on("closed", () => ipc.removeWindow(window));
    }
}
