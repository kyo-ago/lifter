import { MenuItemConstructorOptions, remote } from "electron";

const Menu = remote.Menu;

export class ContextMenuService {
    initialize(target: EventTarget) {
        target.addEventListener("contextmenu", evn => {
            evn.preventDefault();
            let menu = Menu.buildFromTemplate([
                {
                    role: "toggledevtools"
                }
            ]);
            menu.popup(remote.getCurrentWindow());
        });
    }

    contextmenuAutoResponderEntry(callback: () => void) {
        this.show([
            {
                label: "delete",
                click: callback
            }
        ]);
    }

    private show(menuTemplate: MenuItemConstructorOptions[]) {
        menuTemplate.push({
            role: "toggledevtools"
        });
        let menu = Menu.buildFromTemplate(menuTemplate);
        menu.popup(remote.getCurrentWindow());
    }
}
