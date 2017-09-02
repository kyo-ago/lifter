import * as windowManager from "@kyo-ago/electron-window-manager";
import {app, BrowserWindow, ipcMain} from "electron";
import {createMenu} from "./windows/main/create-menu";
import {APPLICATION_NAME, WindowManagerInit} from "./settings";

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
