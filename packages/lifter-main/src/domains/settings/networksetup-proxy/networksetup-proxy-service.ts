import { APPLICATION_NAME, ProxyCommandGrantStatus } from "@lifter/lifter-common";
import { NetworksetupProxy } from "@lifter/networksetup-proxy";
import * as fs from "fs";
import { DEVELOP_PROXY_SETTING_COMMAND_PATH, PRODUCTION_PROXY_SETTING_COMMAND_PATH } from "../../../settings";
import { NetworkInterfaceService } from "../network-interface/network-interface-service";
import { NetworkInterfaceEntity } from "../network-interface/network-interface-entity";
import { ProxyBypassDomainEntity } from "../proxy-bypass-domain/proxy-bypass-domain-entity";
import { NetworksetupProxyFactory } from "./lifecycle/networksetup-proxy-factory";
import { NetworksetupProxyEntity } from "./networksetup-proxy-entity";

export interface getNetworksetupProxyService {
    onChangeProxyCommandGrantStatus: (callback: (proxyCommandGrantStatus: ProxyCommandGrantStatus) => void) => void;
    fetchProxyCommandGrantStatus: () => Promise<ProxyCommandGrantStatus>;
    fetchProxyCommandGrantCommands: () => Promise<string[]>;
    changeProxyCommandGrantStatus: () => Promise<ProxyCommandGrantStatus>;
}

export class NetworksetupProxyService {
    private networksetupProxy: NetworksetupProxy;
    private networksetupProxyEntity: NetworksetupProxyEntity;

    constructor(
        private networksetupProxyFactory: NetworksetupProxyFactory,
        private networkInterfaceService: NetworkInterfaceService,
    ) {}

    async load() {
        let path = await this.getCommandPath();
        this.networksetupProxy = new NetworksetupProxy(`${APPLICATION_NAME} sudo prompt`, path);
        let hasGrant = await this.networksetupProxy.hasGrant();
        this.networksetupProxyEntity = this.networksetupProxyFactory.create(hasGrant, this.networksetupProxy);
    }

    getNetworksetupProxyService(): getNetworksetupProxyService {
        return {
            onChangeProxyCommandGrantStatus: (callback: (proxyCommandGrantStatus: ProxyCommandGrantStatus) => void): void => {
                this.networksetupProxyEntity.onChangeStatus(callback);
            },
            fetchProxyCommandGrantStatus: async (): Promise<ProxyCommandGrantStatus> => {
                return this.networksetupProxyEntity.getCurrentStatus();
            },
            fetchProxyCommandGrantCommands: async (): Promise<string[]> => {
                return this.networksetupProxyEntity.getCurrentCommands();
            },
            changeProxyCommandGrantStatus: async (): Promise<ProxyCommandGrantStatus> => {
                return await this.networksetupProxyEntity.toggleGranted();
            },
        };
    }

    enableProxy(): Promise<void> {
        return this.callAllInterface((ni) => ni.enableProxy(this.networksetupProxy));
    }

    disableProxy(): Promise<void> {
        return this.callAllInterface((ni) => ni.disableProxy(this.networksetupProxy));
    }

    clearAutoProxyUrl() {
        return this.callAllInterface((ni) => ni.clearAutoProxyUrl(this.networksetupProxy));
    }

    setAutoProxyUrl() {
        return this.callAllInterface((ni) => ni.setAutoProxyUrl(this.networksetupProxy));
    }

    reloadAutoProxyUrl() {
        return this.callAllInterface((ni) => ni.reloadAutoProxyUrl(this.networksetupProxy));
    }

    setProxyBypassDomains(proxyBypassDomainEntities: ProxyBypassDomainEntity[]) {
        return this.callAllInterface(async (ni) => {
            await ni.setProxyBypassDomains(this.networksetupProxy, proxyBypassDomainEntities);
        });
    }

    private async callAllInterface(
        callback: (networkInterfaceEntity: NetworkInterfaceEntity) => Promise<void>,
    ): Promise<void> {
        return this.networksetupProxyEntity.callGranted(async () => {
            let networkInterfaceEntities = await this.networkInterfaceService.fetchAllInterface();
            await Promise.all(networkInterfaceEntities.map(ni => callback(ni)));
        });
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
