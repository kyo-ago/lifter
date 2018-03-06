import { createApplication } from "@lifter/lifter-main";
import { app } from "electron";
import * as loadDevtool from "electron-load-devtool";
import * as unhandled from "electron-unhandled";
import { REPOSITORY_BASE_DIR_PATH, USER_DATA_PATH } from "../settings";
import { WindowManager } from "./window-manager";

unhandled();

let application = createApplication(REPOSITORY_BASE_DIR_PATH, USER_DATA_PATH);
let windowManager = new WindowManager(application);

app.on("window-all-closed", async () => {
    await application.quit();
    app.quit();
});
app.on("activate", () => windowManager.createMainWindow());

Promise.all([application.load(), windowManager.load(), new Promise(resolve => app.on("ready", resolve))])
    .then(() => {
        application.start(() => {});
        loadDevtool(loadDevtool.VUEJS_DEVTOOLS);
        return windowManager.createMainWindow();
    })
    .catch((...args: any[]) => {
        console.error(args);
    });
