import { APPLICATION_NAME, ProxyCommandGrantStatus } from "@lifter/lifter-common";
import { NetworksetupProxy } from "@lifter/networksetup-proxy";
import * as fs from "fs";
import { DEVELOP_PROXY_SETTING_COMMAND_PATH, PRODUCTION_PROXY_SETTING_COMMAND_PATH } from "../../../settings";
import { UserSettingStorage } from "../../libs/user-setting-storage";
import { NetworkInterfaceRepository } from "../network-interface/lifecycle/network-interface-repository";
import { NetworkInterfaceEntity } from "../network-interface/network-interface-entity";
import { ProxyBypassDomainEntity } from "../proxy-bypass-domain/proxy-bypass-domain-entity";

export class NetworksetupProxyService {
    private _networksetupProxy: NetworksetupProxy;
    private _isGranted: ProxyCommandGrantStatus;

    constructor(
        private userSettingStorage: UserSettingStorage,
        private networkInterfaceRepository: NetworkInterfaceRepository,
    ) {}

    async load() {
        let path = await this.getCommandPath();
        this._networksetupProxy = new NetworksetupProxy(`${APPLICATION_NAME} sudo prompt`, path);
        this._isGranted = (await this._networksetupProxy.hasGrant()) ? "On" : "Off";
    }

    getCurrentStatus(): ProxyCommandGrantStatus {
        return this._isGranted;
    }

    async startProxy() {
        let noAutoEnableProxy = this.userSettingStorage.resolve("noAutoEnableProxy");
        if (noAutoEnableProxy) {
            return;
        }
        if (this._isGranted === "On") {
            await this.enableProxy();
        }
    }

    getNetworksetupProxy(): NetworksetupProxy | null {
        return (this._isGranted === "On") ? this._networksetupProxy : null;
    }

    async grantProxyCommand(): Promise<ProxyCommandGrantStatus> {
        try {
            let result = await this._networksetupProxy.grant();
            this._isGranted = "On";
        } catch (e) {
            // user cancel
            this._isGranted = "Off";
        }
        return this._isGranted;
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

    setProxyBypassDomains(proxyBypassDomainEntities: ProxyBypassDomainEntity[]) {
        return this.callAllEnableInterface((np, ni) => ni.setProxyBypassDomains(np, proxyBypassDomainEntities));
    }

    private async callAllEnableInterface(
        callback: (
            networksetupProxy: NetworksetupProxy,
            networkInterfaceEntity: NetworkInterfaceEntity,
        ) => Promise<any>,
    ) {
        let networkInterfaceEntities = await this.networkInterfaceRepository.resolveAllInterface();
        let networksetupProxy = this.getNetworksetupProxy();
        if (!networksetupProxy) {
            return;
        }
        await Promise.all(
            networkInterfaceEntities.map(ni => {
                return callback(networksetupProxy, ni);
            }),
        );
    }

    private async getCommandPath(): Promise<string> {
        let fsExists = (path: string) => new Promise(resolve => fs.exists(path, resolve));
        if (await fsExists(DEVELOP_PROXY_SETTING_COMMAND_PATH)) {
            return DEVELOP_PROXY_SETTING_COMMAND_PATH;
        }
        if (await fsExists(PRODUCTION_PROXY_SETTING_COMMAND_PATH)) {
            return PRODUCTION_PROXY_SETTING_COMMAND_PATH;
        }
        throw new Error("Missing networksetup-proxy command");
    }
}
