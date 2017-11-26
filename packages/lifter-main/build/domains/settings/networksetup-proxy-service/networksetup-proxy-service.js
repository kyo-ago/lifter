"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const networksetup_proxy_1 = require("networksetup-proxy");
const settings_1 = require("../../../settings");
class NetworksetupProxyService {
    constructor(userSettingStorage, networkInterfaceRepository) {
        this.userSettingStorage = userSettingStorage;
        this.networkInterfaceRepository = networkInterfaceRepository;
    }
    get isGranted() {
        return this._isGranted;
    }
    async load() {
        let path = await this.getCommandPath();
        this._networksetupProxy = new networksetup_proxy_1.NetworksetupProxy(
            `${settings_1.APPLICATION_NAME} sudo prompt`,
            path
        );
        this._isGranted = await this._networksetupProxy.hasGrant();
        if (this._isGranted) {
            return;
        }
        let noGrant = this.userSettingStorage.resolve("noGrant");
        if (noGrant) {
            return;
        }
        return await this.grantProxyCommand();
    }
    getNetworksetupProxy() {
        return this._isGranted ? this._networksetupProxy : null;
    }
    async grantProxyCommand() {
        let result = await this._networksetupProxy.grant().catch(e => e);
        if (!(result instanceof Error)) {
            this._isGranted = true;
            return true;
        }
        await this.userSettingStorage.store("noGrant", true);
        return false;
    }
    enableProxy() {
        return this.callAllEnableInterface((np, ni) => ni.enableProxy(np));
    }
    disableProxy() {
        return this.callAllEnableInterface((np, ni) => ni.disableProxy(np));
    }
    clearAutoProxyUrl() {
        return this.callAllEnableInterface((np, ni) => ni.clearAutoProxyUrl(np));
    }
    setAutoProxyUrl() {
        return this.callAllEnableInterface((np, ni) => ni.setAutoProxyUrl(np));
    }
    reloadAutoProxyUrl() {
        return this.callAllEnableInterface((np, ni) => ni.reloadAutoProxyUrl(np));
    }
    async callAllEnableInterface(callback) {
        let networkInterfaceEntities = await this.networkInterfaceRepository.resolveAllInterface();
        let networksetupProxy = this.getNetworksetupProxy();
        if (!networksetupProxy) {
            return;
        }
        await Promise.all(
            networkInterfaceEntities.map(ni => {
                return callback(networksetupProxy, ni);
            })
        );
    }
    async getCommandPath() {
        let fsExists = path => new Promise(resolve => fs.exists(path, resolve));
        if (await fsExists(settings_1.DEVELOP_PROXY_SETTING_COMMAND_PATH)) {
            return settings_1.DEVELOP_PROXY_SETTING_COMMAND_PATH;
        }
        if (await fsExists(settings_1.PRODUCTION_PROXY_SETTING_COMMAND_PATH)) {
            return settings_1.PRODUCTION_PROXY_SETTING_COMMAND_PATH;
        }
        throw new Error("Missing networksetup-proxy command");
    }
}
exports.NetworksetupProxyService = NetworksetupProxyService;
