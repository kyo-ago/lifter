import {remote, MenuItemConstructorOptions} from 'electron';
import {AutoResponderEntryIdentity} from '../../../../../domains/proxy/auto-responder-entry/auto-responder-entry-identity';

const Menu = remote.Menu;

export class ContextMenuService {
    initialize(target: EventTarget) {
        target.addEventListener('contextmenu', (evn) => {
            evn.preventDefault();
            let menu = Menu.buildFromTemplate([
                {
                    role: 'toggledevtools'
                },
            ]);
            menu.popup(remote.getCurrentWindow());
        });
    }

    contextmenuAutoResponderEntry(id: AutoResponderEntryIdentity) {
        this.show([
            {
                label: 'delete',
                click() {
                    console.log('delete!');
                }
            }
        ])
    }

    private show(menuTemplate: MenuItemConstructorOptions[]) {
        menuTemplate.push(            {
            role: 'toggledevtools'
        });
        let menu = Menu.buildFromTemplate(menuTemplate);
        menu.popup(remote.getCurrentWindow());
    }
}
