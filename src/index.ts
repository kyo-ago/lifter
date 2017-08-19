import {app, BrowserWindow, ipcMain} from "electron";
import {createMenu} from "./main-window/create-menu";
import {ShareRewriteRuleEntityJSON} from "./share/domain/share-rewrite-rule/share-rewrite-rule-entity";

const windowStateKeeper = require('electron-window-state');

let mainWindow: any = null;

let createWindow = () => {
    let mainWindowState = windowStateKeeper({
        defaultWidth: 1000,
        defaultHeight: 800,
        file: 'main-window-state.json',
        acceptFirstMouse: true,
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

app.on('window-all-closed', () => app.quit());

app.on('activate', () => mainWindow || createWindow());

let rewriteRuleSettingWindow: any;
ipcMain.on('openRewriteRuleSettingWindow', (event: any) => {
    let rewriteRuleSettingWindowState = windowStateKeeper({
        defaultWidth: 1000,
        defaultHeight: 800,
        file: 'rewrite-rule-setting-window-state.json',
        acceptFirstMouse: true,
        parent: mainWindow,
    });

    rewriteRuleSettingWindow = new BrowserWindow(rewriteRuleSettingWindowState);
    rewriteRuleSettingWindow.loadURL(`file://${__dirname}/rewrite-rule-setting-window.html`);
    rewriteRuleSettingWindow.on('closed', () => {
        rewriteRuleSettingWindow = null;
    });
    rewriteRuleSettingWindowState.manage(rewriteRuleSettingWindow);
});

ipcMain.on('getUserDataPath', (event: any) => {
    event.returnValue = app.getPath('userData');
});

ipcMain.on('getAllRewriteRules', (event: any) => {
    mainWindow.webContents.send('getAllRewriteRules');
});

ipcMain.on('responseAllRewriteRules', (event: any, allRewriteRules: ShareRewriteRuleEntityJSON[]) => {
    if (rewriteRuleSettingWindow) {
        rewriteRuleSettingWindow.send('responseAllRewriteRules', allRewriteRules);
    }
});

ipcMain.on('overwriteAllRewriteRules', (event: any, allRewriteRules: ShareRewriteRuleEntityJSON[]) => {
    mainWindow.webContents.send('overwriteAllRewriteRules', allRewriteRules);
    if (rewriteRuleSettingWindow) {
        rewriteRuleSettingWindow.close();
    }
});
