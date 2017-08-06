/// <reference path="./http-mitm-proxy/http-mitm-proxy.d.ts" />

interface Dispath {
    (action: {
        type: string;
    }): void;
}
