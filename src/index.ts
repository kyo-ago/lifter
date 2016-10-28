import * as electron from "electron";
const storage = require('electron-json-storage');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow: any = null;

let createWindow = () => {
    debugger;
    storage.get('windowBounds', (error: any, size: any) => {
        if (error) throw error;

        let param = Object.assign({
            width: 600,
            height: 300,
        }, size, {
            'min-width': 500,
            'min-height': 200,
            'accept-first-mouse': true,
        });
        mainWindow = new BrowserWindow(param);
        mainWindow.loadURL(`file://${__dirname}/index.html`);
        mainWindow.on('close', function() {
            storage.set('windowBounds', mainWindow.getBounds());
        });
        mainWindow.on('closed', () => {
            mainWindow = null;
        });
    });
};
app.on('ready', createWindow);
if (process.platform !== 'darwin') {
    app.on('window-all-closed', () => app.quit());
}
app.on('activate', () => mainWindow || createWindow());
