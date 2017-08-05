/// <reference path="./http-mitm-proxy/http-mitm-proxy.d.ts" />
/// <reference path="../node_modules/monapt/dist/monapt.d.ts" />
/// <reference path="../node_modules/electron/electron.d.ts" />

interface Dispath {
    (action: {
        type: string;
    }): void;
}
