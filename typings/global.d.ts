/// <reference path="./http-mitm-proxy/http-mitm-proxy.d.ts" />

interface Dispath {
    (action: {
        type: string;
    }): void;
}

declare module "es6-promisify" {
    function promisify(...args: any[]): (...args: any[]) => Promise<any>;
    export = promisify;
}
