import {remote} from "electron";
import {AutoResponderEntryIdentity} from "../../domain/auto-responder-entry/auto-responder-entry-identity";

const Menu = remote.Menu;
const MenuItem = remote.MenuItem;

export class ContextMenuService {
    constructor(
        private menu = new Menu()
    ) {}

    initialize(target: EventTarget) {
        this.menu.append(new MenuItem({
            role: 'toggledevtools'
        }));

        target.addEventListener('contextmenu', (evn) => {
            evn.preventDefault();
            this.menu.popup(remote.getCurrentWindow());
        });
    }

    contextmenuAutoResponderEntry(id: number) {
        let autoResponderEntryIdentity = new AutoResponderEntryIdentity(id);
        this.menu.append(new MenuItem({
            label: 'delete',
            click() {
                console.log('delete!');
            }
        }));
    }
}