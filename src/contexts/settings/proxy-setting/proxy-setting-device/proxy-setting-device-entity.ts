import {ExecCommand} from "../../../../windows/main/libs/exec-command";
import {networksetupProxy} from "../../../../windows/main/libs/networksetup-proxy-command";
import {NETWORK_HOST_NAME, PROXY_PORT} from "../../../proxy/settings";
import {BaseEntity} from "../../../share/domain/base/base-entity";
import {ParseGetwebproxyCommand} from "../specs/parse-getwebproxy-command";
import {ProxySettingDeviceIdentity} from "./proxy-setting-device-identity";
import {ChangeProxyCommand} from "./specs/change-proxy-command";
import {ProxySettingDeviceHardwarePort} from "./value-objects/proxy-setting-device-hardware-port";
import {ProxySettingDeviceName} from "./value-objects/proxy-setting-device-name";

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
            () => networksetupProxy.setwebproxy(this.name, NETWORK_HOST_NAME, String(PROXY_PORT)),
            () => networksetupProxy.setsecurewebproxy(this.name, NETWORK_HOST_NAME, String(PROXY_PORT)),
            true
        );
    }

    async disableProxy(): Promise<void> {
        if (!this.enabled) return;
        if (!(await this.isProxing())) return;

        return ChangeProxyCommand(
            this,
            () => networksetupProxy.setwebproxystate(this.name, 'off'),
            () => networksetupProxy.setsecurewebproxystate(this.name, 'off'),
            false
        );
    }

    private async isProxing(): Promise<boolean> {
        let results: string[] = await Promise.all([
            ExecCommand.getWebproxy(this),
            ExecCommand.getSecureWebproxy(this),
        ]);
        let result = results.find((stdout) => ParseGetwebproxyCommand(stdout));
        return Boolean(result);
    }
}
