import {app} from 'electron';
import {ProjectFactory} from './domains/proxy/project/lifecycle/project-factory';
import {Application} from './process/main/application';
import {LifecycleContextService} from './process/main/lifecycle-context-service';

app.on('ready', () => application.createWindow());
app.on('window-all-closed', async () => {
    await application.stopProxy();
    app.quit();
});
app.on('activate', () => application.createWindow());

let application = new Application(
    new LifecycleContextService((new ProjectFactory()).create().id),
);
application.load().then(() => application.start());
