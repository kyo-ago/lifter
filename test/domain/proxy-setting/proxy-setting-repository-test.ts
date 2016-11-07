import 'mocha';
import {} from 'node';

import {NetworkServicesDevices, MockProxySettingFile, RestoreProxySettingFile} from '../../mock/exec';

import {ProxySettingRepository} from "../../../src/domain/proxy-setting/proxy-setting-repository";

const assert = require('assert');

describe('ProxySettingRepository', () => {
    afterEach(() => {
        RestoreProxySettingFile();
    });
    it('proxySettingRepository.getProxySetting isGranted', () => {
        MockProxySettingFile(0);
        return new ProxySettingRepository().getProxySetting().then((entity) => {
            assert(entity.isGranted);
        });
    });
    it('proxySettingRepository.getProxySetting !isGranted', () => {
        MockProxySettingFile(500);
        return new ProxySettingRepository().getProxySetting().then((entity) => {
            assert(!entity.isGranted);
        });
    });
    it('proxySettingRepository.getProxySetting devices', () => {
        MockProxySettingFile(500);
        return new ProxySettingRepository().getProxySetting().then((entity) => {
            assert(entity.devices.join("\n") === NetworkServicesDevices);
        });
    });
});