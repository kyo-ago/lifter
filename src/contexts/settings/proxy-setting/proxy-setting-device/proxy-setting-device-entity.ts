import {getSecureWebproxy, getWebproxy} from '../../../../libs/exec-commands';
import {NETWORK_HOST_NAME, PROXY_PORT} from '../../../../settings';
import {BaseEntity} from '../../../share/base/base-entity';
import {networksetupProxy} from '../networksetup-proxy-command';
import {ParseGetwebproxyCommand} from '../specs/parse-getwebproxy-command';
import {ProxySettingDeviceIdentity} from './proxy-setting-device-identity';
import {ChangeProxyCommand} from './specs/change-proxy-command';
import {ProxySettingDeviceHardwarePort} from './value-objects/proxy-setting-device-hardware-port';
import {ProxySettingDeviceName} from './value-objects/proxy-setting-device-name';

export class ProxySettingDeviceEntity extends BaseEntity<ProxySettingDeviceIdentity> {
    constructor(
        identity: ProxySettingDeviceIdentity,
        private _name: ProxySettingDeviceName,
        private _hardwarePort: ProxySettingDeviceHardwarePort,
        public enabled: boolean,
    ) {
        super(identity);
    }

    get name() {
        return this._name.value;
    }

    get hardwarePort() {
        return this._hardwarePort.value;
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
            () => networksetupProxy.setwebproxy(this.hardwarePort, NETWORK_HOST_NAME, String(PROXY_PORT)),
            () => networksetupProxy.setsecurewebproxy(this.hardwarePort, NETWORK_HOST_NAME, String(PROXY_PORT)),
            true
        );
    }

    async disableProxy(): Promise<void> {
        if (!this.enabled) return;
        if (!(await this.isProxing())) return;

        return ChangeProxyCommand(
            this,
            () => networksetupProxy.setwebproxystate(this.hardwarePort, 'off'),
            () => networksetupProxy.setsecurewebproxystate(this.hardwarePort, 'off'),
            false
        );
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
