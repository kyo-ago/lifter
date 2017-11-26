"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_setting_storage_1 = require("./domains/libs/user-setting-storage");
const pac_file_service_1 = require("./domains/proxy/pac-file/pac-file-service");
const project_factory_1 = require("./domains/proxy/project/lifecycle/project-factory");
const networksetup_proxy_service_1 = require("./domains/settings/networksetup-proxy-service/networksetup-proxy-service");
const proxy_bypass_domain_service_1 = require("./domains/settings/proxy-bypass-domain/proxy-bypass-domain-service");
const proxy_setting_service_1 = require("./domains/settings/proxy-setting/proxy-setting-service");
const lifecycle_context_service_1 = require("./lifecycle-context-service");
class LifterMain {
    constructor(projectBaseDir) {
        let projectFactory = new project_factory_1.ProjectFactory();
        let projectEntity = projectFactory.create(projectBaseDir);
        let userSettingStorage = new user_setting_storage_1.UserSettingStorage(projectEntity);
        this.lifecycleContextService = new lifecycle_context_service_1.LifecycleContextService(projectEntity);
        this.networksetupProxyService = new networksetup_proxy_service_1.NetworksetupProxyService(
            userSettingStorage,
            this.lifecycleContextService.networkInterfaceRepository
        );
        this.proxyBypassDomainService = new proxy_bypass_domain_service_1.ProxyBypassDomainService(
            this.lifecycleContextService.proxyBypassDomainRepository,
            this.networksetupProxyService,
            this.lifecycleContextService.networkInterfaceRepository
        );
        this.proxySettingService = new proxy_setting_service_1.ProxySettingService(
            this.networksetupProxyService,
            this.lifecycleContextService.networkInterfaceRepository,
            userSettingStorage
        );
        this.pacFileService = new pac_file_service_1.PacFileService(
            this.lifecycleContextService.autoResponderEntryRepository,
            this.networksetupProxyService
        );
    }
    async load() {
        await this.lifecycleContextService.load();
        await this.networksetupProxyService.load();
        await this.proxyBypassDomainService.load();
        await this.proxySettingService.load();
        await this.pacFileService.load();
    }
}
exports.LifterMain = LifterMain;
