import {remote} from "electron";
const Menu = remote.Menu;
const MenuItem = remote.MenuItem;

export class ContextMenuService {
    setEvent(target: EventTarget) {
        let menu = new Menu();
        menu.append(new MenuItem({
            role: 'toggledevtools'
        }));

        target.addEventListener('contextmenu', (evn) => {
            evn.preventDefault();
            menu.popup(remote.getCurrentWindow());
        });
    }
}