import { createApplication } from "@lifter/lifter-main";
import { app } from "electron";
import * as loadDevtool from "electron-load-devtool";
import * as unhandled from "electron-unhandled";
import {
    REPOSITORY_BASE_DIR_PATH,
    USER_DATA_PATH,
    USER_HOME_PATH,
} from "../settings";
import { ApplicationSubscriber } from "./application-subscriber";
import { WindowManager } from "./window-manager";

unhandled();

(async () => {
    let [application] = await Promise.all([
        createApplication(
            REPOSITORY_BASE_DIR_PATH,
            USER_DATA_PATH,
            USER_HOME_PATH,
        ),
        new Promise(resolve => app.on("ready", resolve)),
    ]);
    ApplicationSubscriber(application);
    let windowManager = new WindowManager(application);
    windowManager.load();

    app.on("window-all-closed", async () => {
        await application.shutdown();
        app.quit();
    });
    app.on("activate", () => windowManager.createMainWindow());

    try {
        application.startup();
        loadDevtool(loadDevtool.VUEJS_DEVTOOLS);
        await windowManager.createMainWindow();
    } catch (err) {
        console.error(err);
    }
})();
