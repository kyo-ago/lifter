import {app, Menu, shell, ipcMain} from "electron";
import {CertificateStatus} from "./application/certificate/certificate-service";
import {ProxySettingStatus} from "./application/proxy-setting/proxy-setting-service";

let separator = {type: 'separator'};
let makeRoles = (roles: (string | Object)[]) => roles.map((role) => (typeof role === 'string' ? {role} : role));

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
        'NoPermission': 'ProxyService NoPermission',
        'On': 'ProxyService off',
        'Off': 'ProxyService on',
    })[baseProxySettingStatus];

    let certificateStatusMessage = ({
        'missing': 'SSL certificate installed',
        'installed': 'SSL certificate missing',
    })[baseCertificateStatus];

    const template: any = [
        {
            label: 'Edit',
            submenu: makeRoles([
                'undo', 'redo', separator, 'cut', 'copy', 'paste',
                'pasteandmatchstyle', 'delete', 'selectall',
            ]),
        },
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
                    label: 'Add replace entry',
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
            submenu: makeRoles([
                'reload', 'toggledevtools', separator, 'resetzoom',
                'zoomin', 'zoomout', separator, 'togglefullscreen',
            ]),
        },
        {
            role: 'window',
            submenu: makeRoles(['minimize', 'close', ]),
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
            {role: 'about'},
            separator,
            {
                label: 'Preferences',
                accelerator: 'CmdOrCtrl+,',
                click: () => targetWindow.webContents.send("openPreferencesWindow")
            },
            separator,
            {
                role   : 'services',
                submenu: []
            },
        ].concat(<any>makeRoles([separator, 'hide', 'hideothers', 'unhide', separator, 'quit', ])),
    });

    // Window menu.
    (template.find((menu: any) => menu.label === 'window') || <any>{}).submenu = [
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
        separator,
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
