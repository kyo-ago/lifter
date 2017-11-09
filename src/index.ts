import {app} from 'electron';
import {ProjectFactory} from './domains/proxy/project/lifecycle/project-factory';
import {Application} from './process/main/application';
import {LifecycleContextService} from './process/main/lifecycle-context-service';
import {REPOSITORY_BASE_DIR_PATH} from "./settings";

app.on('window-all-closed', async () => {
    await application.quit();
    app.quit();
});
app.on('activate', () => application.createMainWindow());

let projectEntity = (new ProjectFactory()).create(REPOSITORY_BASE_DIR_PATH);
let application = new Application(
    projectEntity,
    new LifecycleContextService(projectEntity),
);

Promise.all([
    application.load(),
    new Promise((resolve) => app.on('ready', resolve)),
]).then(() => {
    application.start();
    return application.createMainWindow();
});
