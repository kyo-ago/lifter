import {app, BrowserWindow, ipcMain} from "electron";
import {createMenu} from "./main-window/create-menu";
import {APPLICATION_NAME, WindowManagerInit} from "./settings";
import {ShareRewriteRuleEntityJSON} from "./share/domain/share-rewrite-rule/share-rewrite-rule-entity";

const windowManager = require('@kyo-ago/electron-window-manager');
windowManager.init(WindowManagerInit);

let createWindow = () => {
    let mainWindow = windowManager.open('mainWindow', APPLICATION_NAME, '/index.html', 'default', {
        file: 'main-window-state.json',
    });
    createMenu(mainWindow);
};

app.on('ready', createWindow);
app.on('window-all-closed', () => app.quit());
app.on('activate', () => windowManager.get('mainWindow') || createWindow());

ipcMain.on('getUserDataPath', (event: any) => {
    event.returnValue = app.getPath('userData');
});
