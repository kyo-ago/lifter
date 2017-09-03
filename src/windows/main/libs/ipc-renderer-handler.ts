import {ipcRenderer} from "electron";
import {CertificateStatus} from "../application/certificate/certificate-service";
import {ProxySettingStatus} from "../application/proxy-setting/proxy-setting-service";

interface Handlers {
}

interface Senders {
}

interface SyncSenders {
    "getUserDataPath": void;
}

class IpcRendererHandler<Handlers, Senders, SyncSenders> {
    on<Key extends keyof Handlers>(type: Key, listener: (ipcRendererEvent: any, ev?: Handlers[Key]) => void): void {
        ipcRenderer.on(type, listener);
    }

    send<Key extends keyof Senders>(type: Key, ev?: Senders[Key]): void {
        ev ? ipcRenderer.send(type, ev) : ipcRenderer.send(type);
    }

    sendSync<Key extends keyof SyncSenders>(type: Key, ev?: SyncSenders[Key]): any {
        return <any>(ev ? ipcRenderer.sendSync(type, ev) : ipcRenderer.sendSync(type));
    }
}

export const ipcRendererHandler = new IpcRendererHandler<Handlers, Senders, SyncSenders>();
