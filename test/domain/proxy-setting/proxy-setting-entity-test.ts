import "mocha";
import {
    MockingProxySettingFile,
    RestoreProxySettingFile,
    LIST_NETWORK_SERVICE_RESULT,
    RestoreChildProcess,
    MockingChildProcess
} from "../../mock/exec";
import {ProxySettingEntity} from "../../../src/domain/proxy-setting/proxy-setting-entity";
import {ProxySettingFactory} from "../../../src/domain/proxy-setting/proxy-setting-factory";
import {PROXY_SETTING_COMMAND, NETWORK_SETUP_COMMAND} from "../../../src/domain/settings";

const assert = require('assert');

describe('ProxySettingEntity', () => {
    let proxySettingEntity: ProxySettingEntity;
    beforeEach(() => {
        proxySettingEntity = ProxySettingFactory.create(LIST_NETWORK_SERVICE_RESULT, <any>{uid: 0});
    });
    afterEach(() => {
        RestoreProxySettingFile();
        RestoreChildProcess();
    });
    it('grantProxy', () => {
        MockingProxySettingFile(500);
        return proxySettingEntity.grantProxy().then((result: boolean) => {
            assert(result);
        });
    });
    it('enableProxy', () => {
        MockingChildProcess((command: string, callback: (error: string, stdout: string, stderr: string) => void) => {
            if (command.match(new RegExp(`^${PROXY_SETTING_COMMAND} -setwebproxy`))) {
                callback(undefined, '', '');
                return true;
            }
            return false;
        });
        return proxySettingEntity.enableProxy().then((result: boolean) => {
            assert(result);
        });
    });
    it('enableProxy failed', () => {
        let count = 0;
        MockingChildProcess((command: string, callback: (error: string, stdout: string, stderr: string) => void) => {
            if (command.match(new RegExp(`^${PROXY_SETTING_COMMAND} -setwebproxy`))) {
                callback(undefined, '', count++ ? '' : 'error');
                return true;
            }
            return false;
        });
        return proxySettingEntity.enableProxy().then((result: boolean) => {
            assert(!result);
        });
    });
    it('hasProxy', () => {
        MockingChildProcess((command: string, callback: (error: string, stdout: string, stderr: string) => void) => {
            if (command.match(new RegExp(`^${NETWORK_SETUP_COMMAND} -getwebproxy`))) {
                callback(undefined, 'Enabled: Yes\nServer: localhost\nPort: 8888\nAuthenticated Proxy Enabled: 0\n', '');
                return true;
            }
            return false;
        });
        return proxySettingEntity.hasProxy().then((result: boolean) => {
            assert(result);
        });
    });
    it('hasProxy failed', () => {
        let count = 0;
        MockingChildProcess((command: string, callback: (error: string, stdout: string, stderr: string) => void) => {
            if (command.match(new RegExp(`^${NETWORK_SETUP_COMMAND} -getwebproxy`))) {
                callback(undefined, `Enabled: ${count++ ? 'Yes' : 'No'}\nServer: localhost\nPort: 8888\nAuthenticated Proxy Enabled: 0\n`, '');
                return true;
            }
            return false;
        });
        return proxySettingEntity.hasProxy().then((result: boolean) => {
            assert(!result);
        });
    });
    it('disableProxy', () => {
        MockingChildProcess((command: string, callback: (error: string, stdout: string, stderr: string) => void) => {
            if (command.match(new RegExp(`^${PROXY_SETTING_COMMAND} -setwebproxystate`))) {
                callback(undefined, '', '');
                return true;
            }
            return false;
        });
        return proxySettingEntity.disableProxy().then((result: boolean) => {
            assert(result);
        });
    });
});