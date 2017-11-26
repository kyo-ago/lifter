import { UserSettingStorage } from "../../libs/user-setting-storage";
import { NetworkInterfaceRepository } from "../network-interface/lifecycle/network-interface-repository";
import { NetworksetupProxyService } from "../networksetup-proxy-service/networksetup-proxy-service";
export declare type ProxySettingStatus = "NoPermission" | "On" | "Off";
export declare class ProxySettingService {
    private networksetupProxyService;
    private networkInterfaceRepository;
    private userSettingStorage;
    constructor(
        networksetupProxyService: NetworksetupProxyService,
        networkInterfaceRepository: NetworkInterfaceRepository,
        userSettingStorage: UserSettingStorage
    );
    load(): Promise<void>;
    getCurrentStatus(): Promise<ProxySettingStatus>;
    getNewStatus(): Promise<ProxySettingStatus>;
    clearProxyState(): Promise<void>;
    private isProxing();
    private clearProxy();
}
