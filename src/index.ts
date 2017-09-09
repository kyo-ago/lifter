import * as windowManager from "@kyo-ago/electron-window-manager";
import {app} from "electron";
import {APPLICATION_NAME, WindowManagerInit} from "./settings";

windowManager.init(WindowManagerInit);

let createWindow = () => {
    windowManager.open('mainWindow', APPLICATION_NAME, '/index.html', 'default', {
        file: 'main-window-state.json',
    });
};

app.on('ready', createWindow);
app.on('window-all-closed', () => {
    app.quit();
});
app.on('activate', () => windowManager.get('mainWindow') || createWindow());
