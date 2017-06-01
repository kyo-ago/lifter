import {remote} from "electron";
import {eventEmitter} from "../../libs/event-emitter";
const Menu = remote.Menu;
const MenuItem = remote.MenuItem;

export class ContextMenuService {
    bind(target: EventTarget) {
        let menu = new Menu();
        menu.append(new MenuItem({
            role: 'toggledevtools'
        }));

        target.addEventListener('contextmenu', (evn) => {
            evn.preventDefault();
            menu.popup(remote.getCurrentWindow());
        });

        eventEmitter.addListener("contextmenuClientRequest", () => {
            this.bind(window);
        });
    }
}