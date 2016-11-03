import 'mocha';
import {} from 'node';

import "../../mock/exec";

import {ProxySettingEntity} from "../../../src/domain/proxy-setting/proxy-setting-entity";
import {ProxySettingFactory} from "../../../src/domain/proxy-setting/proxy-setting-factory";

const Path   = require('path');
const assert = require('assert');
const mockFs = require('mock-fs');

describe('ProxySettingEntity', () => {
    afterEach(() => {
        mockFs.restore();
    });
    it('grantProxy', () => {
        let proxySettingEntity = ProxySettingFactory.create('', {uid: 0});
        return proxySettingEntity.grantProxy().then((entity) => {
            assert(entity.isGranted);
        });
    });
});