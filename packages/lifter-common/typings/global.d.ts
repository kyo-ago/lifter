/// <reference path="./electron-ipc/electron-ipc.d.ts" />
/// <reference path="./electron-window-manager/electron-window-manager.d.ts" />

interface Dispath {
    (
        action: {
            type: string;
        },
    ): void;
}
