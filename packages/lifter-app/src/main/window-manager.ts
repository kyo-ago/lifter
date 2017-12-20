import * as windowManager from "@kyo-ago/electron-window-manager";
import { APPLICATION_NAME } from "@kyo-ago/lifter-common";
import { Application } from "@kyo-ago/lifter-main/build/Application/Application";
import { ipc } from "../libs/ipc";
import { WINDOW_STATE_DIR, WindowManagerInit } from "../settings";

export class WindowManager {
    constructor(private application: Application) {}

    async load() {
        windowManager.init(WindowManagerInit);

        windowManager.bridge.on("overwriteRewriteRules", this.application.saveRewriteRuleJSON.bind(this.application));

        windowManager.bridge.on(
            "overwriteProxyBypassDomains",
            this.application.saveProxyBypassDomainJSON.bind(this.application)
        );

        ipc.subscribe("openRewriteRuleSettingWindow", this.openRewriteRuleSettingWindow.bind(this));

        ipc.subscribe("openProxyBypassDomainSettingWindow", this.openProxyBypassDomainSettingWindow.bind(this));

        ipc.subscribe("openPreferencesWindow", this.openPreferencesWindow.bind(this));
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

        let state = await this.application.getMainState();
        windowManager.sharedData.set("mainApps", state);
        windowManager.open(name, APPLICATION_NAME, url, "default", {
            file: `${WINDOW_STATE_DIR}main-window-state.json`
        });
        if (isDevelopment) {
            windowManager
                .get(name)
                .content()
                .openDevTools();
        }
        this.registerWindow(name);
    }

    private async openProxyBypassDomainSettingWindow() {
        let allJsons = await this.application.getProxyBypassDomains();
        windowManager.sharedData.set("mainProxyBypassDomains", allJsons);
        let name = "proxyBypassDomainSettingWindow";
        windowManager.open(name, "Proxy bypass domain setting", "/proxy-bypass-domain-setting-window.html", "default", {
            file: `${WINDOW_STATE_DIR}proxy-bypass-domain-setting-window-state.json`,
            parent: windowManager.get("mainWindow")
        });
        this.registerWindow(name);
    }

    private async openRewriteRuleSettingWindow() {
        let allJsons = await this.application.getRewriteRules();
        windowManager.sharedData.set("mainRewriteRules", allJsons);
        let name = "rewriteRuleSettingWindow";
        windowManager.open(name, "Rewrite rule setting", "/rewrite-rule-setting-window.html", "default", {
            file: `${WINDOW_STATE_DIR}rewrite-rule-setting-window-state.json`,
            parent: windowManager.get("mainWindow")
        });
        this.registerWindow(name);
    }

    private async openPreferencesWindow() {
        // let allJsons = await this.application.getPreferences();
        // windowManager.sharedData.set("mainPreferences", allJsons);
        // let name = "preferencesWindow";
        // windowManager.open(name, "Preferences", "/preferences-window.html", "default", {
        //     file: `${WINDOW_STATE_DIR}preferences-window-state.json`,
        //     parent: windowManager.get("mainWindow")
        // });
        // this.registerWindow(name);
    }

    private registerWindow(name: string) {
        let window = windowManager.get(name);
        ipc.addWindow(window.object);
        window.object.on("closed", () => ipc.removeWindow(window));
    }
}
