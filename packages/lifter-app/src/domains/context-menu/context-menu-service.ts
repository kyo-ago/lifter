import * as contextMenu from "electron-context-menu";
import { BrowserWindow, ContextMenuParams, MenuItem } from "electron";

type ContextMenuEventType = "prepend" | "append";

interface ContextMenuHandler {
    (event: ContextMenuEvent): MenuItem | undefined;
}

export interface ContextMenuEvent {
    type: ContextMenuEventType;
    params: ContextMenuParams;
    browserWindow: BrowserWindow;
}

export class ContextMenuService {
    private handlers: ContextMenuHandler[] = [];

    bind() {
        let next = (type: ContextMenuEventType, params: ContextMenuParams, browserWindow: BrowserWindow): MenuItem[] => {
            let event: ContextMenuEvent = {
                type,
                params,
                browserWindow,
            };
            return this.handlers.map((handler) => handler(event)).filter((result) => result);
        };
        let handler = (type: ContextMenuEventType) => {
            return (params: ContextMenuParams, browserWindow: BrowserWindow) => {
                let results = next(type, params, browserWindow);
                return results.length ? results : undefined;
            };
        };
        contextMenu({
            prepend: handler("prepend"),
            append: handler("append"),
        });
    }

    subscribe(handler: ContextMenuHandler): () => void {
        this.handlers.push(handler);
        return () => {
            this.handlers = this.handlers.filter((val) => val !== handler);
        };
    }
}
