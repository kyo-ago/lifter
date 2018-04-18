import { APPLICATION_NAME, ProxyCommandGrantStatus } from "@lifter/lifter-common";
import { NetworksetupProxy } from "@lifter/networksetup-proxy";
import * as fs from "fs";
import { DEVELOP_PROXY_SETTING_COMMAND_PATH, PRODUCTION_PROXY_SETTING_COMMAND_PATH } from "../../../settings";
import { NetworkInterfaceRepository } from "../network-interface/lifecycle/network-interface-repository";
import { NetworkInterfaceEntity } from "../network-interface/network-interface-entity";
import { ProxyBypassDomainEntity } from "../proxy-bypass-domain/proxy-bypass-domain-entity";

export interface getNetworksetupProxyService {
    fetchProxyCommandGrantStatus: () => Promise<ProxyCommandGrantStatus>;
    changeProxyCommandGrantStatus: () => Promise<ProxyCommandGrantStatus>;
}

export class NetworksetupProxyService {
    private _networksetupProxy: NetworksetupProxy;
    private _isGranted: ProxyCommandGrantStatus;

    constructor(private networkInterfaceRepository: NetworkInterfaceRepository) {}

    async load() {
        let path = await this.getCommandPath();
        this._networksetupProxy = new NetworksetupProxy(`${APPLICATION_NAME} sudo prompt`, path);
        this._isGranted = (await this._networksetupProxy.hasGrant()) ? "On" : "Off";
    }

    getNetworksetupProxyService(): getNetworksetupProxyService {
        return {
            fetchProxyCommandGrantStatus: async (): Promise<ProxyCommandGrantStatus> => {
                return this.getCurrentStatus();
            },
            changeProxyCommandGrantStatus: (): Promise<ProxyCommandGrantStatus> => {
                return this.toggleGrantProxyCommand();
            },
        };
    }

    enableProxy() {
        if (!this.hasGrant()) {
            return Promise.resolve(void 0);
        }
        return this.callAllEnableInterface((np, ni) => ni.enableProxy(np));
    }

    disableProxy() {
        if (!this.hasGrant()) {
            return Promise.resolve(void 0);
        }
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

    private getNetworksetupProxy(): NetworksetupProxy | null {
        return this.hasGrant() ? this._networksetupProxy : null;
    }

    private async toggleGrantProxyCommand(): Promise<ProxyCommandGrantStatus> {
        if (!this.hasGrant()) {
            try {
                await this._networksetupProxy.grant();
                this._isGranted = "On";
            } catch (e) {
                // user cancel
                this._isGranted = "Off";
            }
        } else {
            await this._networksetupProxy.removeGrant();
            this._isGranted = "Off";
        }
        return this._isGranted;
    }

    private hasGrant(): boolean {
        return this.getCurrentStatus() === "On";
    }

    private getCurrentStatus(): ProxyCommandGrantStatus {
        return this._isGranted;
    }

    private async callAllEnableInterface(
        callback: (
            networksetupProxy: NetworksetupProxy,
            networkInterfaceEntity: NetworkInterfaceEntity,
        ) => Promise<any>,
    ): Promise<any> {
        let networkInterfaceEntities = await this.networkInterfaceRepository.resolveAllInterface();
        let networksetupProxy = this.getNetworksetupProxy();
        await Promise.all(
            networkInterfaceEntities.map(ni => {
                return networksetupProxy ? callback(networksetupProxy, ni) : undefined;
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
