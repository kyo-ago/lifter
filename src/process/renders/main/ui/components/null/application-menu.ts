import {remote} from 'electron';
import * as React from 'react';
import {GlobalProps} from '../index';

let separator = {type: 'separator'};
let makeRoles = (roles: (string | Object)[]) => roles.map((role) => (typeof role === 'string' ? {role} : role));

export class ApplicationMenu extends React.Component<GlobalProps, {}> {
    componentDidMount() {
        let template = this.getTemplate();
        let menu = remote.Menu.buildFromTemplate(template);
        remote.Menu.setApplicationMenu(menu);
    }

    render(): any {
        return null;
    }

    private addAutoResponderEntry() {
        remote.dialog.showOpenDialog(null, {
            properties: ['openDirectory', 'openFile', 'createDirectory'],
        }, (filePaths) => {
            this.props.selectDialogEntry(filePaths);
        });
    }

    private getTemplate() {
        let proxySettingStatusMessage = ({
            'NoPermission': 'ProxyService NoPermission',
            'On': 'Turn off proxy',
            'Off': 'Turn on proxy',
        })[this.props.proxySettingStatus];

        let certificateStatusMessage = ({
            'missing': 'Install SSL certificate',
            'installed': 'Delete SSL certificate',
        })[this.props.certificateState];

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
                        click: this.props.clickProxySettingStatus,
                    },
                    {
                        label: 'Add auto responder entry',
                        click: this.addAutoResponderEntry.bind(this),
                    },
                    {
                        label: certificateStatusMessage,
                        click: this.props.clickCertificateStatus,
                    },
                    {
                        label: 'Open rewrite rule setting',
                        click: this.props.openRewriteRuleSettingWindow,
                    },
                    {
                        label: 'Open proxy bypass domain setting',
                        click: this.props.openProxyBypassDomainSettingWindow,
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
                        click () { remote.shell.openExternal('http://electron.atom.io') }
                    },
                ],
            },
        ];

        if (process.platform !== 'darwin') {
            return template;
        }

        template.unshift({
            label  : remote.app.getName(),
            submenu: [
                {role: 'about'},
                separator,
                {
                    label: 'Preferences',
                    accelerator: 'CmdOrCtrl+,',
//                    click: () => this.props.openPreferencesWindow(),
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

        return template;
    }
}
