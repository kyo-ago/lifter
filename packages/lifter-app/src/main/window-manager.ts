import * as windowManager from "@lifter/electron-window-manager";
import { APPLICATION_NAME } from "@lifter/lifter-common";
import { Application } from "@lifter/lifter-main";
import { ipc } from "../lib/ipc";
import { WINDOW_STATE_DIR, WindowManagerInit } from "../settings";
import { getApplicationMainStateJSON } from "./application-main-state";

export class WindowManager {
    constructor(private application: Application) {}

    load() {
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

        let state = await getApplicationMainStateJSON(this.application);
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
