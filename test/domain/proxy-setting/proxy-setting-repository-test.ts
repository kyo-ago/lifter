import 'mocha';
import {} from 'node';

const fakeExec = require('fake-exec');
let devices = `Thunderbolt Ethernet
Apple USB Ethernet Adapter
Wi-Fi
Bluetooth PAN
Thunderbolt Bridge`;
fakeExec('/usr/sbin/networksetup -listallnetworkservices', `An asterisk (*) denotes that a network service is disabled.
${devices}
`);

import {PROXY_SETTING_COMMAND} from "../../../src/domain/settings";
import {ProxySettingRepository} from "../../../src/domain/proxy-setting/proxy-setting-repository";

const Path   = require('path');
const assert = require('assert');
const mockFs = require('mock-fs');

let execMockFs = (uidgid: number) => {
    mockFs({
        [PROXY_SETTING_COMMAND]: mockFs.file({
            mode: parseInt('0755', 8),
            uid: uidgid,
            gid: uidgid,
        }),
    });
};

describe('ProxySettingRepository', () => {
    afterEach(() => {
        mockFs.restore();
    });
    it('proxySettingRepository.getProxySetting isGranted', () => {
        execMockFs(0);
        return new ProxySettingRepository().getProxySetting().then((entity) => {
            assert(entity.isGranted);
        });
    });
    it('proxySettingRepository.getProxySetting !isGranted', () => {
        execMockFs(500);
        return new ProxySettingRepository().getProxySetting().then((entity) => {
            assert(!entity.isGranted);
        });
    });
    it('proxySettingRepository.getProxySetting devices', () => {
        return new ProxySettingRepository().getProxySetting().then((entity) => {
            assert(entity.devices.join("\n") === devices);
        });
    });
});