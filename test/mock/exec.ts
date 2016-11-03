import {PROXY_SETTING_COMMAND} from "../../src/domain/settings";
const fakeExec = require('fake-exec');
const mockFs = require('mock-fs');

export const NetworkServicesDevices = `Thunderbolt Ethernet
Apple USB Ethernet Adapter
Wi-Fi
Bluetooth PAN
Thunderbolt Bridge`;

fakeExec('/usr/sbin/networksetup -listallnetworkservices', `An asterisk (*) denotes that a network service is disabled.
${NetworkServicesDevices}
`);

export function MockProxySettingCommand(uidgid: number) {
    mockFs({
        [PROXY_SETTING_COMMAND]: mockFs.file({
            mode: parseInt('0666', 8),
            uid: uidgid,
            gid: uidgid,
        }),
    });
};
