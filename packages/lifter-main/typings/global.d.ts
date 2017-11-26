/// <reference path="./es6-promisify/es6-promisify.d.ts" />
/// <reference path="./ifconfig/ifconfig.d.ts" />

interface Dispath {
    (
        action: {
            type: string;
        }
    ): void;
}

interface NetworkDeviceParam {
    name: string;
    serviceName: string;
    enable: boolean;
}
