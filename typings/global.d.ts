/// <reference path="./electron-window-manager/electron-window-manager.d.ts" />
/// <reference path="./http-mitm-proxy/http-mitm-proxy.d.ts" />

interface Dispath {
    (action: {
        type: string;
    }): void;
}

declare module "es6-promisify" {
    function promisify(...args: any[]): (...args: any[]) => Promise<any>;
    namespace promisify { }
    export = promisify;
}

interface Ifconfig {
    [name: string]: {
        flags: string;
        ether?: string;
        options?: string;
        media?: string;
        status?: "inactive" | "active";
        inet6?: string;
        inet?: string;
    }
}

declare module "ifconfig" {
    function ifconfig(callback: (err: any, configs: Ifconfig) => void): void;
    namespace ifconfig { }
    export = ifconfig;
}

interface NetworkDeviceParam {
    name: string;
    hardwarePort: string;
    enable: boolean;
}
