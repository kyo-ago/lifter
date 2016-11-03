import 'mocha';
import {} from 'node';

import {NetworkServicesDevices, MockProxySettingCommand} from '../../mock/exec';

import {ProxySettingRepository} from "../../../src/domain/proxy-setting/proxy-setting-repository";

const Path   = require('path');
const assert = require('assert');
const mockFs = require('mock-fs');

describe('ProxySettingRepository', () => {
    afterEach(() => {
        mockFs.restore();
    });
    it('proxySettingRepository.getProxySetting isGranted', () => {
        MockProxySettingCommand(0);
        return new ProxySettingRepository().getProxySetting().then((entity) => {
            assert(entity.isGranted);
        });
    });
    it('proxySettingRepository.getProxySetting !isGranted', () => {
        MockProxySettingCommand(500);
        return new ProxySettingRepository().getProxySetting().then((entity) => {
            assert(!entity.isGranted);
        });
    });
    it('proxySettingRepository.getProxySetting devices', () => {
        return new ProxySettingRepository().getProxySetting().then((entity) => {
            assert(entity.devices.join("\n") === NetworkServicesDevices);
        });
    });
});