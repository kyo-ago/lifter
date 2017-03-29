import "mocha";
import {
    MockingProxySettingFile,
    RestoreProxySettingFile,
    RestoreChildProcess,
    MockingChildProcess,
    LIST_NETWORK_SERVICE_ORDER_RESULT, IFCONFIG_RESULT, ENABLE_GET_WEB_PROXY_RESULT, DISABLE_GET_WEB_PROXY_RESULT
} from "../../mock/exec";
import {ProxySettingEntity} from "../../../src/domain/proxy-setting/proxy-setting-entity";
import {ProxySettingFactory} from "../../../src/domain/proxy-setting/proxy-setting-factory";
import {
    NETWORK_SETUP_COMMAND
} from "../../../src/domain/settings";

const assert = require('assert');

describe('ProxySettingEntity', () => {
    let proxySettingEntity: ProxySettingEntity;
    beforeEach(() => {
        proxySettingEntity = ProxySettingFactory.create(
            LIST_NETWORK_SERVICE_ORDER_RESULT,
            IFCONFIG_RESULT,
            <any>{uid: 0},
        );
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
    it('hasProxy enable', () => {
        MockingChildProcess((command: string, callback: (error: string, stdout: string, stderr: string) => void) => {
            if (command.match(new RegExp(`^${NETWORK_SETUP_COMMAND} -get(secure)?webproxy ".+?"$`))) {
                callback(undefined, ENABLE_GET_WEB_PROXY_RESULT, '');
                return true;
            }
            return false;
        });
        return proxySettingEntity.hasProxy().then((result: boolean) => {
            assert(result);
        });
    });
    it('hasProxy disable', () => {
        MockingChildProcess((command: string, callback: (error: string, stdout: string, stderr: string) => void) => {
            if (command.match(new RegExp(`^${NETWORK_SETUP_COMMAND} -get(secure)?webproxy ".+?"$`))) {
                callback(undefined, DISABLE_GET_WEB_PROXY_RESULT, '');
                return true;
            }
            return false;
        });
        return proxySettingEntity.hasProxy().then((result: boolean) => {
            assert(!result);
        });
    });
});