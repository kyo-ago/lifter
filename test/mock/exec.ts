import {PROXY_SETTING_COMMAND} from "../../src/domain/settings";

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

mockRequire('electron-sudo', class {
    exec() {
        return Promise.resolve({stdout: '', stderr: ''});
    }
});

export function MockingProxySettingFile(uidgid: number) {
    mockFs({
        [PROXY_SETTING_COMMAND]: mockFs.file({
            mode: parseInt('0666', 8),
            uid: uidgid,
            gid: uidgid,
        }),
    });
};

export function RestoreProxySettingFile() {
    mockFs.restore();
};
