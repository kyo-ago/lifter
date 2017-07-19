import {ipcRenderer} from "electron";

export class ShareIpcRendererHandler<Handlers, Senders, SyncSenders> {
    on<K extends keyof Handlers>(type: K, listener: (ipcRendererEvent: any, ev?: Handlers[K]) => void): void {
        ipcRenderer.on(type, listener);
    }

    send<K extends keyof Senders>(type: K, ev?: Senders[K]): void {
        ev ? ipcRenderer.send(type, ev) : ipcRenderer.send(type);
    }

    sendSync<K extends keyof SyncSenders>(type: K, ev?: SyncSenders[K]): SyncSenders[K] {
        return ev ? ipcRenderer.sendSync(type, ev) : ipcRenderer.sendSync(type);
    }
}
