import { APPLICATION_NAME } from "@lifter/lifter-common";
import * as fs from "fs";
import { NetworksetupProxy } from "@lifter/networksetup-proxy";
import { DEVELOP_PROXY_SETTING_COMMAND_PATH, PRODUCTION_PROXY_SETTING_COMMAND_PATH } from "../../../settings";
import { UserSettingStorage } from "../../libs/user-setting-storage";
import { NetworkInterfaceRepository } from "../network-interface/lifecycle/network-interface-repository";
import { NetworkInterfaceEntity } from "../network-interface/network-interface-entity";

export class NetworksetupProxyService {
    private _networksetupProxy: NetworksetupProxy;
    private _isGranted: boolean;

    constructor(
        private userSettingStorage: UserSettingStorage,
        private networkInterfaceRepository: NetworkInterfaceRepository
    ) {}

    get isGranted(): boolean {
        return this._isGranted;
    }

    async load() {
        let path = await this.getCommandPath();
        this._networksetupProxy = new NetworksetupProxy(`${APPLICATION_NAME} sudo prompt`, path);
        this._isGranted = await this._networksetupProxy.hasGrant();
    }

    async startProxy() {
        let noAutoGrantRequest = this.userSettingStorage.resolve("noAutoGrantRequest");
        if (!this.isGranted && !noAutoGrantRequest) {
            await this.grantProxyCommand();
        }

        let noAutoEnableProxy = this.userSettingStorage.resolve("noAutoEnableProxy");
        if (this.isGranted && !noAutoEnableProxy) {
            await this.enableProxy();
        }
    }

    getNetworksetupProxy(): NetworksetupProxy | null {
        return this._isGranted ? this._networksetupProxy : null;
    }

    async grantProxyCommand(): Promise<boolean> {
        let result = await this._networksetupProxy.grant().catch(e => e);
        if (!(result instanceof Error)) {
            this._isGranted = true;
            await this.userSettingStorage.store("noAutoGrantRequest", false);
            return true;
        }
        await this.userSettingStorage.store("noAutoGrantRequest", true);
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

    private async callAllEnableInterface(
        callback: (networksetupProxy: NetworksetupProxy, networkInterfaceEntity: NetworkInterfaceEntity) => Promise<any>
    ) {
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
