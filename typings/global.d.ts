/// <reference path="./electron-ipc/electron-ipc.d.ts" />
/// <reference path="./electron-window-manager/electron-window-manager.d.ts" />
/// <reference path="./es6-promisify/es6-promisify.d.ts" />
/// <reference path="./http-mitm-proxy/http-mitm-proxy.d.ts" />
/// <reference path="./ifconfig/ifconfig.d.ts" />

interface Dispath {
    (action: {
        type: string;
    }): void;
}

interface NetworkDeviceParam {
    name: string;
    serviceName: string;
    enable: boolean;
}
