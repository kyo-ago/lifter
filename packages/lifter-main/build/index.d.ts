import { PacFileService } from "./domains/proxy/pac-file/pac-file-service";
import { NetworksetupProxyService } from "./domains/settings/networksetup-proxy-service/networksetup-proxy-service";
import { ProxyBypassDomainService } from "./domains/settings/proxy-bypass-domain/proxy-bypass-domain-service";
import { ProxySettingService } from "./domains/settings/proxy-setting/proxy-setting-service";
import { LifecycleContextService } from "./lifecycle-context-service";
export declare class LifterMain {
    lifecycleContextService: LifecycleContextService;
    networksetupProxyService: NetworksetupProxyService;
    proxyBypassDomainService: ProxyBypassDomainService;
    proxySettingService: ProxySettingService;
    pacFileService: PacFileService;
    constructor(projectBaseDir: string);
    load(): Promise<void>;
}
