import { NetworksetupProxy } from "networksetup-proxy";
import { UserSettingStorage } from "../../libs/user-setting-storage";
import { NetworkInterfaceRepository } from "../network-interface/lifecycle/network-interface-repository";
export declare class NetworksetupProxyService {
    private userSettingStorage;
    private networkInterfaceRepository;
    private _networksetupProxy;
    private _isGranted;
    constructor(userSettingStorage: UserSettingStorage, networkInterfaceRepository: NetworkInterfaceRepository);
    readonly isGranted: boolean;
    load(): Promise<boolean>;
    getNetworksetupProxy(): NetworksetupProxy | null;
    grantProxyCommand(): Promise<boolean>;
    enableProxy(): Promise<void>;
    disableProxy(): Promise<void>;
    clearAutoProxyUrl(): Promise<void>;
    setAutoProxyUrl(): Promise<void>;
    reloadAutoProxyUrl(): Promise<void>;
    private callAllEnableInterface(callback);
    private getCommandPath();
}
