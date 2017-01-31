import {app, Menu, shell, ipcMain} from "electron";
import {CertificateStatus} from "./domain/certificate/certificate-service";
import {ProxySettingStatus} from "./domain/proxy-setting/proxy-setting-service";

let baseCertificateStatus: CertificateStatus = "missing";
let baseProxySettingStatus: ProxySettingStatus = "NoPermission";
let targetWindow: any;

ipcMain.on("clickCertificateStatus", (event: any, certificateStatus: CertificateStatus) => {
    baseCertificateStatus = certificateStatus;
    setApplicationMenu();
});
ipcMain.on("clickProxySettingStatus", (event: any, proxySettingStatus: ProxySettingStatus) => {
    baseProxySettingStatus = proxySettingStatus;
    setApplicationMenu();
});

function setApplicationMenu() {
    if (!targetWindow) {
        return;
    }

    let proxySettingStatusMessage = ({
        'NoPermission': 'Proxy NoPermission',
        'On': 'Proxy on',
        'Off': 'Proxy off',
    })[baseProxySettingStatus];

    let certificateStatusMessage = ({
        'missing': 'SSL certificate missing',
        'installed': 'SSL certificate install',
    })[baseCertificateStatus];

    const template: any = [
        {
            label: 'Proxy',
            submenu: [
                {
                    label: proxySettingStatusMessage,
                    click () {
                        targetWindow.webContents.send("clickProxySettingStatus");
                    }
                },
                {
                    label: 'add Replace entry',
                    click () {
                        targetWindow.webContents.send("addAutoResponderEntry");
                    }
                },
                {
                    label: certificateStatusMessage,
                    click () {
                        targetWindow.webContents.send("clickCertificateStatus");
                    }
                },
            ]
        },
        {
            label: 'View',
            submenu: [
                {
                    role: 'reload'
                },
                {
                    role: 'toggledevtools'
                },
                {
                    type: 'separator'
                },
                {
                    role: 'resetzoom'
                },
                {
                    role: 'zoomin'
                },
                {
                    role: 'zoomout'
                },
                {
                    type: 'separator'
                },
                {
                    role: 'togglefullscreen'
                },
            ],
        },
        {
            role: 'window',
            submenu: [
                {
                    role: 'minimize'
                },
                {
                    role: 'close'
                },
            ],
        },
        {
            role: 'help',
            submenu: [
                {
                    label: 'Learn More',
                    click () { shell.openExternal('http://electron.atom.io') }
                },
            ],
        },
    ];

    if (process.platform !== 'darwin') {
        return template;
    }

    template.unshift({
                         label  : app.getName(),
                         submenu: [
                             {
                                 role: 'about'
                             },
                             {
                                 type: 'separator'
                             },
                             {
                                 role   : 'services',
                                 submenu: []
                             },
                             {
                                 type: 'separator'
                             },
                             {
                                 role: 'hide'
                             },
                             {
                                 role: 'hideothers'
                             },
                             {
                                 role: 'unhide'
                             },
                             {
                                 type: 'separator'
                             },
                             {
                                 role: 'quit'
                             },
                         ],
                     });
    // Window menu.
    template[3].submenu = [
        {
            label: 'Close',
            accelerator: 'CmdOrCtrl+W',
            role: 'close'
        },
        {
            label: 'Minimize',
            accelerator: 'CmdOrCtrl+M',
            role: 'minimize'
        },
        {
            label: 'Zoom',
            role: 'zoom'
        },
        {
            type: 'separator'
        },
        {
            label: 'Bring All to Front',
            role: 'front'
        }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

export function createMenu(mainWindow: any) {
    targetWindow = mainWindow;
    setApplicationMenu();
}
