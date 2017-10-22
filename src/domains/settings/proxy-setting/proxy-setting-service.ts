import {getSecureWebproxy, getWebproxy} from "../../../libs/exec-commands";
import {throwableCommand} from '../../../libs/throwable-command';
import {NETWORK_HOST_NAME, PROXY_PORT} from "../../../settings";
import {networksetupProxy} from '../lib/networksetup-proxy-command';
import {NetworkInterfaceRepository} from '../network-interface/lifecycle/network-interface-repository';
import {NetworkInterfaceEntity} from "../network-interface/network-interface-entity";
import {ChangeProxyCommand} from "../network-interface/specs/change-proxy-command";
import {ParseGetwebproxyCommand} from "./specs/parse-getwebproxy-command";

export type ProxySettingStatus = "NoPermission" | "On" | "Off";

export class ProxySettingService {
    public isGranted: boolean;

    constructor(
        private networkInterfaceRepository: NetworkInterfaceRepository,
    ) {
    }

    async load() {
        this.isGranted = await networksetupProxy.hasGrant();
    }

    async getCurrentStatus(): Promise<ProxySettingStatus> {
        if (!this.isGranted) {
            return "NoPermission";
        }
        return (await this.isProxing()) ? "On" : "Off";
    }

    async getNewStatus(): Promise<ProxySettingStatus> {
        if (!this.isGranted) {
            await this.grantProxy();
            this.isGranted = true;
            return (await this.isProxing()) ? "On" : "Off";
        }

        if (await this.isProxing()) {
            await this.disableProxy();
            return "Off";
        } else {
            await this.enableProxy();
            return "On";
        }
    }

    async clearProxyState(): Promise<void> {
        await this.clearProxy();
        return;
    }

    private async grantProxy() {
        await throwableCommand(networksetupProxy.grant());
        return true;
    }

    private async isProxing(): Promise<boolean> {
        let networkInterfaceEntities = await this.networkInterfaceRepository.resolveAllEnableInterface();
        let results = await Promise.all(networkInterfaceEntities.map(async (networkInterfaceEntity: NetworkInterfaceEntity) => {
            return networkInterfaceEntity.enabled ? this.isProxingInterface(networkInterfaceEntity) : false;
        }));
        return results.find((result) => result);
    }

    private async enableProxy(): Promise<void[]> {
        let networkInterfaceEntities = await this.networkInterfaceRepository.resolveAllEnableInterface();
        return Promise.all(networkInterfaceEntities.map((ni) => this.enableProxyInterface(ni)));
    }

    private async disableProxy(): Promise<void[]> {
        let networkInterfaceEntities = await this.networkInterfaceRepository.resolveAllEnableInterface();
        return Promise.all(networkInterfaceEntities.map((ni) => this.disableProxyInterface(ni)));
    }

    private async clearProxy(): Promise<void[]> {
        let networkInterfaceEntities = await this.networkInterfaceRepository.resolveAllEnableInterface();
        return Promise.all(networkInterfaceEntities.map((ni) => this.disableProxyInterface(ni)));
    }

    private async enableProxyInterface(networkInterfaceEntity: NetworkInterfaceEntity) {
        if (!networkInterfaceEntity.enabled) return;
        if (await this.isProxingInterface(networkInterfaceEntity)) return;

        return ChangeProxyCommand(
            networkInterfaceEntity,
            () => networksetupProxy.setwebproxy(networkInterfaceEntity.serviceName, NETWORK_HOST_NAME, String(PROXY_PORT)),
            () => networksetupProxy.setsecurewebproxy(networkInterfaceEntity.serviceName, NETWORK_HOST_NAME, String(PROXY_PORT)),
            true
        );
    }

    private async disableProxyInterface(networkInterfaceEntity: NetworkInterfaceEntity) {
        if (!networkInterfaceEntity.enabled) return;
        if (!(await this.isProxingInterface(networkInterfaceEntity))) return;

        return ChangeProxyCommand(
            networkInterfaceEntity,
            () => networksetupProxy.setwebproxystate(networkInterfaceEntity.serviceName, 'off'),
            () => networksetupProxy.setsecurewebproxystate(networkInterfaceEntity.serviceName, 'off'),
            false
        );
    }

    private async isProxingInterface(networkInterfaceEntity: NetworkInterfaceEntity): Promise<boolean> {
        let results: string[] = await Promise.all([
            getWebproxy(networkInterfaceEntity),
            getSecureWebproxy(networkInterfaceEntity),
        ]);
        let result = results.find((stdout) => ParseGetwebproxyCommand(stdout));
        return Boolean(result);
    }
}