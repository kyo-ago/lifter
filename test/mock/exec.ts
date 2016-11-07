import {PROXY_SETTING_COMMAND} from "../../src/domain/settings";
import {NETWORK_SETUP_COMMAND} from "../../src/libs/exec-command";
const fakeExec = require('fake-exec');
const mockFs = require('mock-fs');
const mockRequire = require('mock-require');

export const NetworkServicesDevices = `Thunderbolt Ethernet
Apple USB Ethernet Adapter
Wi-Fi
Bluetooth PAN
Thunderbolt Bridge`;

fakeExec(`${NETWORK_SETUP_COMMAND} -listallnetworkservices`, `An asterisk (*) denotes that a network service is disabled.
${NetworkServicesDevices}
`);

fakeExec('/usr/sbin/networksetup -listallnetworkservices', `An asterisk (*) denotes that a network service is disabled.
${NetworkServicesDevices}
`);

mockRequire('electron-sudo', class Sudoer {
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
