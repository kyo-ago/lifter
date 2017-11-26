import { UserSettingStorage } from "./domains/libs/user-setting-storage";
import { PacFileService } from "./domains/proxy/pac-file/pac-file-service";
import { ProjectFactory } from "./domains/proxy/project/lifecycle/project-factory";
import { NetworksetupProxyService } from "./domains/settings/networksetup-proxy-service/networksetup-proxy-service";
import { ProxyBypassDomainService } from "./domains/settings/proxy-bypass-domain/proxy-bypass-domain-service";
import { ProxySettingService } from "./domains/settings/proxy-setting/proxy-setting-service";
import { LifecycleContextService } from "./lifecycle-context-service";

export class LifterMain {
    public lifecycleContextService: LifecycleContextService;
    public networksetupProxyService: NetworksetupProxyService;
    public proxyBypassDomainService: ProxyBypassDomainService;
    public proxySettingService: ProxySettingService;
    public pacFileService: PacFileService;

    constructor(projectBaseDir: string) {
        let projectFactory = new ProjectFactory();
        let projectEntity = projectFactory.create(projectBaseDir);
        let userSettingStorage = new UserSettingStorage(projectEntity);

        this.lifecycleContextService = new LifecycleContextService(projectEntity);
        this.networksetupProxyService = new NetworksetupProxyService(
            userSettingStorage,
            this.lifecycleContextService.networkInterfaceRepository
        );
        this.proxyBypassDomainService = new ProxyBypassDomainService(
            this.lifecycleContextService.proxyBypassDomainRepository,
            this.networksetupProxyService,
            this.lifecycleContextService.networkInterfaceRepository
        );
        this.proxySettingService = new ProxySettingService(
            this.networksetupProxyService,
            this.lifecycleContextService.networkInterfaceRepository,
            userSettingStorage
        );
        this.pacFileService = new PacFileService(
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
