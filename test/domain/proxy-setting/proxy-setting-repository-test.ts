import 'mocha';
import {} from 'node';
import {PROXY_SETTING_COMMAND} from "../../../src/domain/settings";
import {ProxySettingRepository} from "../../../src/domain/proxy-setting/proxy-setting-repository";

const Path     = require('path');
const assert   = require('assert');
const fakeExec = require('fake-exec');
const mockFs   = require('mock-fs');

describe.only('ProxySettingRepository', () => {
    afterEach(() => {
        fakeExec.clear();
        mockFs.restore();
    });
    it('get proxySettingRepository.getProxySetting', () => {
        fakeExec('/usr/sbin/networksetup -listallnetworkservices', `An asterisk (*) denotes that a network service is disabled.
Thunderbolt Ethernet
Apple USB Ethernet Adapter
Wi-Fi
Bluetooth PAN
Thunderbolt Bridge
`);
        mockFs({
            [PROXY_SETTING_COMMAND]: mockFs.file({
                mode: parseInt('0666', 8),
                uid: 500,
                gid: 500,
            }),
        });
        let proxySettingRepository = new ProxySettingRepository();
        return proxySettingRepository.getProxySetting().then((a) => {
            console.log(a)
        });
    });
});