import 'mocha';
import {} from 'node';

import {MockProxySettingFile, RestoreProxySettingFile, LIST_NETWORK_SERVICE_RESULT} from "../../mock/exec";

import {ProxySettingEntity} from "../../../src/domain/proxy-setting/proxy-setting-entity";
import {ProxySettingFactory} from "../../../src/domain/proxy-setting/proxy-setting-factory";

const assert = require('assert');

describe('ProxySettingEntity', () => {
    let proxySettingEntity: ProxySettingEntity;
    beforeEach(() => {
        proxySettingEntity = ProxySettingFactory.create(LIST_NETWORK_SERVICE_RESULT, <any>{uid: 0});
    });
    afterEach(() => {
        RestoreProxySettingFile();
    });
    it('grantProxy', () => {
        MockProxySettingFile(500);
        return proxySettingEntity.grantProxy().then((result: boolean) => {
            assert(result);
        });
    });
    it('enableProxy', () => {
        return proxySettingEntity.enableProxy().then(function () {
            console.log(arguments)
        });
    });
});