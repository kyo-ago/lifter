import * as windowManager from "@lifter/electron-window-manager";
import {
    APPLICATION_NAME,
    AutoResponderEntityJSON,
    CertificateStatus,
    ClientRequestEntityJSON,
    ipc,
    ProxyBypassDomainEntityJSON,
    ProxyCommandGrantStatus,
    ProxySettingStatus,
    RewriteRuleEntityJSON,
} from "@lifter/lifter-common";
import { Application } from "@lifter/lifter-main";
import { WINDOW_STATE_DIR, WindowManagerInit } from "../settings";

export interface ApplicationMainStateJSON {
    autoResponderEntries: AutoResponderEntityJSON[];
    clientRequestEntries: ClientRequestEntityJSON[];
    proxyBypassDomainEntries: ProxyBypassDomainEntityJSON[];
    rewriteRuleEntries: RewriteRuleEntityJSON[];
    certificateState: CertificateStatus;
    proxySettingStatus: ProxySettingStatus;
    proxyCommandGrantStatus: ProxyCommandGrantStatus;
    noAutoEnableProxySetting: boolean;
    noPacFileProxySetting: boolean;
}

export class WindowManager {
    constructor(private application: Application) {}

    async load() {
        windowManager.init(WindowManagerInit);
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

        let [
            autoResponderEntries,
            clientRequestEntries,
            proxyBypassDomainEntries,
            rewriteRuleEntries,
            certificateState,
            proxySettingStatus,
            proxyCommandGrantStatus,
            noAutoEnableProxySetting,
            noPacFileProxySetting,
        ] = await Promise.all([
            this.application.getAutoResponder().fetchAll(),
            this.application.getClientRequestService().fetchAll(),
            this.application.getProxyBypassDomains().fetchAll(),
            this.application.getRewriteRules().fetchAll(),
            this.application.getCertificateService().fetchCurrentStatus(),
            this.application.getProxySettingService().fetch(),
            this.application.getNetworksetupProxyService().getProxyCommandGrantStatus(),
            this.application.getUserSetting().getNoAutoEnableProxy(),
            this.application.getUserSetting().getNoPacFileProxy(),
        ]);
        let state: ApplicationMainStateJSON = {
            autoResponderEntries,
            clientRequestEntries,
            proxyBypassDomainEntries,
            rewriteRuleEntries,
            certificateState,
            proxySettingStatus,
            proxyCommandGrantStatus,
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
        this.registerWindow(name);
    }

    private registerWindow(name: string) {
        let window = windowManager.get(name);
        ipc.addWindow(window.object);
        window.object.on("closed", () => ipc.removeWindow(window));
    }
}
