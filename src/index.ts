import {app, BrowserWindow, ipcMain} from "electron";
import * as Path from "path";
import * as Datastore from "nedb";

import "./create-menu";
import {createMenu} from "./create-menu";
import {DATA_STORE_FILENAME} from "./domain/settings";
import {AutoResponderService} from "./domain/auto-responder/auto-responder-service";

const windowStateKeeper = require('electron-window-state');

let mainWindow: any = null;

console.log(app.getPath('userData'))

let createWindow = () => {
    let mainWindowState = windowStateKeeper({
        defaultWidth: 1000,
        defaultHeight: 800,
    });

    mainWindow = new BrowserWindow(mainWindowState);
    mainWindow.loadURL(`file://${__dirname}/index.html`);
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
    mainWindowState.manage(mainWindow);
    createMenu(mainWindow);
};
app.on('ready', createWindow);

if (process.platform !== 'darwin') {
    app.on('window-all-closed', () => app.quit());
}
app.on('activate', () => mainWindow || createWindow());

ipcMain.on('init-render', () => {
    let datastore = new Datastore({
        filename: Path.join(app.getPath('userData'), DATA_STORE_FILENAME),
        autoload: true,
    });

    /**
     * AutoResponderService
     */
    let autoResponderService = new AutoResponderService(datastore);
    let subject = autoResponderService.createSubject();

    autoResponderService.getObserver().subscribe((autoResponderBoxEntry: AutoResponderBoxEntry) => {
        dispatch(AppActions.fileDrop(autoResponderBoxEntry));
    });
    autoResponderService.loadFile().then((autoResponderSettingFileEntities: AutoResponderSettingFileEntity[]) => {
        return autoResponderSettingFileEntities
    });
});
