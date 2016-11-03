import 'mocha';
import {} from 'node';

import {MockProxySettingCommand} from "../../mock/exec";
var mock = require('mock-require');
mock('electron-sudo', class Sudoer {
    exec() {
        return new Promise.resolve({stdout: '', stderr: ''});
    }
});

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
        MockProxySettingCommand(500);
        return ProxySettingFactory.create('', <any>{uid: 0}).grantProxy().then((result: boolean) => {
            assert(result);
        });
    });
});