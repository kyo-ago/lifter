import { app } from "electron";
import { REPOSITORY_BASE_DIR_PATH, USER_DATA_PATH } from "../settings";
import { createApplication } from "@kyo-ago/lifter-main";
import { WindowManager } from "./window-manager";

let application = createApplication(REPOSITORY_BASE_DIR_PATH, USER_DATA_PATH);
let windowManager = new WindowManager(application);

app.on("window-all-closed", async () => {
    await application.quit();
    app.quit();
});
app.on("activate", () => windowManager.createMainWindow());

Promise.all([application.load(), new Promise(resolve => app.on("ready", resolve))])
    .then(() => {
        application.start(() => {});
        return windowManager.createMainWindow();
    })
    .catch((...args: any[]) => {
        console.error(args);
    });
