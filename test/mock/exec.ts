import {Ifconfig} from "../../src/domain/proxy-setting/proxy-setting-repository";

const mockFs = require('mock-fs');
const mockRequire = require('mock-require');

export const NETWORK_SERVICE_DEVICES = `Thunderbolt Ethernet
Apple USB Ethernet Adapter
Wi-Fi
Bluetooth PAN
Thunderbolt Bridge`;
export const LIST_NETWORK_SERVICE_RESULT = `An asterisk (*) denotes that a network service is disabled.
${NETWORK_SERVICE_DEVICES}
`;

export const LIST_NETWORK_SERVICE_ORDER_RESULT = `
An asterisk (*) denotes that a network service is disabled.
(1) Thunderbolt Ethernet
(Hardware Port: Thunderbolt Ethernet, Device: en3)

(2) Apple USB Ethernet Adapter
(Hardware Port: Apple USB Ethernet Adapter, Device: en5)

(3) Display Ethernet
(Hardware Port: Display Ethernet, Device: en6)

(4) Display FireWire
(Hardware Port: Display FireWire, Device: fw0)

(5) Wi-Fi
(Hardware Port: Wi-Fi, Device: en0)

(6) Bluetooth PAN
(Hardware Port: Bluetooth PAN, Device: en4)

(7) Thunderbolt Bridge
(Hardware Port: Thunderbolt Bridge, Device: bridge0)

`;

export const IFCONFIG_RESULT: Ifconfig = {
    "lo0": {
        "flags": "flag flag flag...",
        "options": "option option option...",
        "inet6": "fe80::1%lo0 prefixlen 64 scopeid 0x1",
        "inet": "127.0.0.1 netmask 0xff000000"
    },
    "en3": {
        "flags": "flag flag flag...",
        "options": "option option option...",
        "ether": "ether",
        "inet6": "inet6",
        "inet": "inet",
        "media": "media",
        "status": "active"
    },
    "en6": {
        "flags": "flag flag flag...",
        "options": "option option option...",
        "ether": "ether",
        "media": "autoselect (none)",
        "status": "inactive"
    },
};

export const ENABLE_GET_WEB_PROXY_RESULT = `Enabled: Yes
Server: localhost
Port: 8888
Authenticated Proxy Enabled: 0
`;

export const DISABLE_GET_WEB_PROXY_RESULT = `Enabled: No
Server: 
Port: 0
Authenticated Proxy Enabled: 0
`;

let childProcessMock: (command: string, callback: (error: string, stdout: string, stderr: string) => void) => boolean;
let defaultChildProcessMock = () => {
    console.error('Default child_process mock error! require call MockingChildProcess');
    return false;
};
childProcessMock = defaultChildProcessMock;
export function MockingChildProcess(func: (command: string, callback: (error: string, stdout: string, stderr: string) => void) => boolean) {
    childProcessMock = func;
}
export function RestoreChildProcess() {
    childProcessMock = defaultChildProcessMock;
}
mockRequire('child_process', {
    exec: (command: string, callback: (error: string, stdout: string, stderr: string) => void) => {
        let result = childProcessMock(command, callback);
        if (result) {
            return;
        }
        console.error(`Mock require unsupported command. command = "${command}"`);
    }
});

mockRequire('electron-sudo', {
    default: class {
        exec() {
            return Promise.resolve({stdout: '', stderr: ''});
        }
    }
});

mockRequire('ifconfig', (callback: (err: any, configs: Ifconfig) => any) => {
    callback(undefined, IFCONFIG_RESULT);
});

export function RestoreProxySettingFile() {
    mockFs.restore();
}
