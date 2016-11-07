import 'mocha';
import {} from 'node';

import {MockProxySettingFile, RestoreProxySettingFile} from "../../mock/exec";

import {ProxySettingEntity} from "../../../src/domain/proxy-setting/proxy-setting-entity";
import {ProxySettingFactory} from "../../../src/domain/proxy-setting/proxy-setting-factory";

const assert = require('assert');

describe('ProxySettingEntity', () => {
    afterEach(() => {
        RestoreProxySettingFile();
    });
    it('grantProxy', () => {
        MockProxySettingFile(500);
        return ProxySettingFactory.create('', <any>{uid: 0}).grantProxy().then((result: boolean) => {
            assert(result);
        });
    });
    it('enableProxy', () => {
        return ProxySettingFactory.create('a\nb\n', <any>{uid: 0}).enableProxy().then(function () {
            console.log(arguments)
        });
    });
});