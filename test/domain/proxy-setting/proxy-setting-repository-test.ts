import "mocha";
import {
    NETWORK_SERVICE_DEVICES,
    MockingProxySettingFile,
    RestoreProxySettingFile,
    MockingChildProcess,
    RestoreChildProcess,
    LIST_NETWORK_SERVICE_ORDER_RESULT
} from "../../mock/exec";
import {ProxySettingRepository} from "../../../src/domain/proxy-setting/proxy-setting-repository";
import {NETWORK_SETUP_COMMAND} from "../../../src/domain/settings";

const assert = require('assert');

describe('ProxySettingRepository', () => {
    before(() => {
        MockingChildProcess((command: string, callback: (error: string, stdout: string, stderr: string) => void) => {
            if (command.match(new RegExp(`^${NETWORK_SETUP_COMMAND} -listnetworkserviceorder`))) {
                callback(undefined, LIST_NETWORK_SERVICE_ORDER_RESULT, '');
                return true;
            }
            return false;
        });
    });
    after(() => {
        RestoreChildProcess();
    });
    afterEach(() => {
        RestoreProxySettingFile();
    });
    it('proxySettingRepository.getProxySetting isGranted', () => {
        MockingProxySettingFile(0);
        return new ProxySettingRepository().getProxySetting().then((entity) => {
            assert(entity.isGranted);
        });
    });
    it('proxySettingRepository.getProxySetting !isGranted', () => {
        MockingProxySettingFile(500);
        return new ProxySettingRepository().getProxySetting().then((entity) => {
            assert(!entity.isGranted);
        });
    });
    it('proxySettingRepository.getProxySetting devices', () => {
        MockingProxySettingFile(500);
        return new ProxySettingRepository().getProxySetting().then((entity) => {
            assert(entity.devices.join("\n") === 'Thunderbolt Ethernet');
        });
    });
});