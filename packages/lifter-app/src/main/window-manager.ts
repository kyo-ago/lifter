import * as windowManager from "@lifter/electron-window-manager";
import { APPLICATION_NAME } from "@lifter/lifter-common";
import { Application } from "@lifter/lifter-main";
import { ipc } from "../libs/ipc";
import { WINDOW_STATE_DIR, WindowManagerInit } from "../settings";

export class WindowManager {
    constructor(private application: Application) {}

    async load() {
        windowManager.init(WindowManagerInit);

        windowManager.bridge.on("overwriteRewriteRules", this.application.saveRewriteRuleJSON.bind(this.application));

        windowManager.bridge.on(
            "overwriteProxyBypassDomains",
            this.application.saveProxyBypassDomainJSON.bind(this.application),
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

        let state = await this.application.getMainState();
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
