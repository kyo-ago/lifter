import {app, Menu, shell, ipcMain} from "electron";
import {CertificateStatus} from "./domain/certificate/certificate-service";

ipcMain.on('clickCertificateStatus', (status: CertificateStatus) => {
    console.log(status);
});

const template: any = [
    {
        label: 'Proxy',
        submenu: [
            {
                label: 'Proxy on',
                click () { console.log(111) }
            },
            {
                label: 'add Replace entry',
                click () { console.log(111) }
            },
            {
                label: 'SSL certificate install',
                click () { console.log(222) }
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

if (process.platform === 'darwin') {
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
}

export function createMenu () {
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}
