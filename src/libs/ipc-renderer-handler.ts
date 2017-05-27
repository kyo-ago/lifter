import {ipcRenderer} from "electron";
import IpcRendererEvent = Electron.IpcRendererEvent;
import {CertificateStatus} from "../application/certificate/certificate-service";
import {ProxySettingStatus} from "../application/proxy-setting/proxy-setting-service";

interface IpcRendererHandlerMap {
    "clickCertificateStatus": void;
    "clickProxySettingStatus": void;
    "addAutoResponderEntry": void;
}

interface IpcRendererSenderMap {
    "clickCertificateStatus": CertificateStatus;
    "clickProxySettingStatus": ProxySettingStatus;
}

interface IpcRendererSyncSenderMap {
    "getUserDataPath": string;
}

export class ipcRendererHandler {
    static on<K extends keyof IpcRendererHandlerMap>(type: K, listener: (ipcRendererEvent: IpcRendererEvent, ev?: IpcRendererHandlerMap[K]) => void): void {
        ipcRenderer.on(type, listener);
    }

    static send<K extends keyof IpcRendererSenderMap>(type: K, ev?: IpcRendererSenderMap[K]): void {
        ev ? ipcRenderer.send(type, ev) : ipcRenderer.send(type);
    }

    static sendSync<K extends keyof IpcRendererSyncSenderMap>(type: K, ev?: IpcRendererSyncSenderMap[K]): IpcRendererSyncSenderMap[K] {
        return ev ? ipcRenderer.sendSync(type, ev) : ipcRenderer.sendSync(type);
    }
}
