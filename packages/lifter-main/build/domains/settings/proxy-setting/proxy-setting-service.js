"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ProxySettingService {
    constructor(networksetupProxyService, networkInterfaceRepository, userSettingStorage) {
        this.networksetupProxyService = networksetupProxyService;
        this.networkInterfaceRepository = networkInterfaceRepository;
        this.userSettingStorage = userSettingStorage;
    }
    async load() {
        let isGranted = this.networksetupProxyService.isGranted;
        let noProxy = this.userSettingStorage.resolve("noProxy");
        if (isGranted && !noProxy) {
            await this.networksetupProxyService.enableProxy();
        }
    }
    async getCurrentStatus() {
        if (!this.networksetupProxyService.isGranted) {
            return "NoPermission";
        }
        let isProxing = await this.isProxing();
        return isProxing ? "On" : "Off";
    }
    async getNewStatus() {
        if (!this.networksetupProxyService.isGranted) {
            let result = await this.networksetupProxyService.grantProxyCommand();
            if (!result) {
                return "NoPermission";
            }
            return (await this.isProxing()) ? "On" : "Off";
        }
        let isProxing = await this.isProxing();
        if (isProxing) {
            await Promise.all([
                this.networksetupProxyService.disableProxy(),
                this.userSettingStorage.store("noProxy", true)
            ]);
            return "Off";
        }
        await Promise.all([
            this.networksetupProxyService.enableProxy(),
            this.userSettingStorage.store("noProxy", false)
        ]);
        return "On";
    }
    async clearProxyState() {
        if (!this.networksetupProxyService.isGranted) {
            return;
        }
        await this.clearProxy();
        return;
    }
    async isProxing() {
        let networkInterfaceEntities = await this.networkInterfaceRepository.resolveAllInterface();
        let results = await Promise.all(networkInterfaceEntities.map(ni => ni.isProxing()));
        return results.find(result => result);
    }
    clearProxy() {
        return this.networksetupProxyService.disableProxy();
    }
}
exports.ProxySettingService = ProxySettingService;
