import {app} from 'electron';
import {ProjectFactory} from './domains/proxy/project/lifecycle/project-factory';
import {Application} from './process/main/application';
import {LifecycleContextService} from './process/main/lifecycle-context-service';

app.on('window-all-closed', async () => {
    await application.stopProxy();
    app.quit();
});
app.on('activate', () => application.createMainWindow());

let application = new Application(
    new LifecycleContextService((new ProjectFactory()).create().getIdentity()),
);

Promise.all([
    application.load(),
    new Promise((resolve) => app.on('ready', resolve)),
]).then(() => {
    application.start();
    application.createMainWindow();
});
