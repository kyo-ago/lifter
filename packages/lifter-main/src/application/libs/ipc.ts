import { ElectronIpcMap } from "@lifter/lifter-common";
import * as Ipc from "electron-ipc";

export const ipc = class {
    static subscribe<K extends keyof ElectronIpcMap>(
        key: K,
        callback: (event: any, message: any) => Promise<ElectronIpcMap[K]> | void,
    ): void {
        return Ipc.subscribe(key, callback);
    }
};
