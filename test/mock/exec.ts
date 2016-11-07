import {PROXY_SETTING_COMMAND, NETWORK_SETUP_COMMAND} from "../../src/domain/settings";

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

mockRequire('child_process', {
    exec: (command: string, callback: (error: string, stdout: string, stderr: string) => void) => {
        if (command.match(new RegExp(`^${NETWORK_SETUP_COMMAND} -listallnetworkservices`))) {
            return callback(undefined, LIST_NETWORK_SERVICE_RESULT, '')
        }
        if (command.match(new RegExp(`^${PROXY_SETTING_COMMAND} -setwebproxy`))) {
            return callback(undefined, '', '')
        }
        console.error(`Mock require unsupported command. command = "${command}"`);
    }
});

mockRequire('electron-sudo', class {
    exec() {
        return Promise.resolve({stdout: '', stderr: ''});
    }
});

export function MockProxySettingFile(uidgid: number) {
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
