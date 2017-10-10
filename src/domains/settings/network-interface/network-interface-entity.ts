import {getSecureWebproxy, getWebproxy} from '../../../libs/exec-commands';
import {NETWORK_HOST_NAME, PROXY_PORT} from '../../../settings';
import {BaseEntity} from '../../share/base/base-entity';
import {networksetupProxy} from '../lib/networksetup-proxy-command';
import {ParseGetwebproxyCommand} from '../proxy-setting/specs/parse-getwebproxy-command';
import {NetworkInterfaceIdentity} from './network-interface-identity';
import {ChangeProxyCommand} from './specs/change-proxy-command';
import {NetworkInterfaceName} from './value-objects/network-interface-name';
import {NetworkInterfaceServiceName} from "./value-objects/network-interface-service-name";

export class NetworkInterfaceEntity extends BaseEntity<NetworkInterfaceIdentity> {
    constructor(
        identity: NetworkInterfaceIdentity,
        private _name: NetworkInterfaceName,
        private _serviceName: NetworkInterfaceServiceName,
        public enabled: boolean,
    ) {
        super(identity);
    }

    get name() {
        return this._name.value;
    }

    get serviceName() {
        return this._serviceName.value;
    }

    proxing(): Promise<boolean> {
        return this.enabled
            ? this.isProxing()
            : Promise.resolve(false)
        ;
    }

    async enableProxy(): Promise<void> {
        if (!this.enabled) return;
        if (await this.isProxing()) return;

        return ChangeProxyCommand(
            this,
            () => networksetupProxy.setwebproxy(this.serviceName, NETWORK_HOST_NAME, String(PROXY_PORT)),
            () => networksetupProxy.setsecurewebproxy(this.serviceName, NETWORK_HOST_NAME, String(PROXY_PORT)),
            true
        );
    }

    async disableProxy(): Promise<void> {
        if (!this.enabled) return;
        if (!(await this.isProxing())) return;

        return ChangeProxyCommand(
            this,
            () => networksetupProxy.setwebproxystate(this.serviceName, 'off'),
            () => networksetupProxy.setsecurewebproxystate(this.serviceName, 'off'),
            false
        );
    }

    clearProxy(): Promise<void> {
        return this.disableProxy();
    }

    private async isProxing(): Promise<boolean> {
        let results: string[] = await Promise.all([
            getWebproxy(this),
            getSecureWebproxy(this),
        ]);
        let result = results.find((stdout) => ParseGetwebproxyCommand(stdout));
        return Boolean(result);
    }
}
