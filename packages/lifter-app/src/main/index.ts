import { app } from "electron";
import {REPOSITORY_BASE_DIR_PATH, USER_DATA_PATH} from "../settings";
import {createApplication} from '@kyo-ago/lifter-main';

let application = createApplication(REPOSITORY_BASE_DIR_PATH, USER_DATA_PATH);

app.on("window-all-closed", async () => {
    await application.quit();
    app.quit();
});
app.on("activate", () => application.createMainWindow());

Promise.all([application.load(), new Promise(resolve => app.on("ready", resolve))])
    .then(() => {
        application.start();
        return application.createMainWindow();
    })
    .catch((...args: any[]) => {
        console.error(args);
    })
;
