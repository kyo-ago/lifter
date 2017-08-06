import {ipcRenderer} from "electron";

export class ShareIpcRendererHandler<Handlers, Senders, SyncSenders> {
    on<Key extends keyof Handlers>(type: Key, listener: (ipcRendererEvent: any, ev?: Handlers[Key]) => void): void {
        ipcRenderer.on(type, listener);
    }

    send<Key extends keyof Senders>(type: Key, ev?: Senders[Key]): void {
        ev ? ipcRenderer.send(type, ev) : ipcRenderer.send(type);
    }

    sendSync<Key extends keyof SyncSenders>(type: Key, ev?: SyncSenders[Key]): SyncSenders[Key] {
        return <any>(ev ? ipcRenderer.sendSync(type, ev) : ipcRenderer.sendSync(type));
    }
}
