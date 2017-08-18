import {BaseEntity} from "../../../../share/domain/base/base-entity";
import {ExecCommand} from "../../../libs/exec-command";
import {networksetupProxy} from "../../../libs/networksetup-proxy-command";
import {NETWORK_HOST_NAME, PROXY_PORT} from "../../settings";
import {ParseGetwebproxyCommand} from "../specs/parse-getwebproxy-command";
import {ProxySettingDeviceIdentity} from "./proxy-setting-device-identity";
import {ChangeProxyCommand} from "./specs/change-proxy-command";
import {ProxySettingDeviceHardwarePort} from "./value-objects/proxy-setting-device-hardware-port";
import {ProxySettingDeviceName} from "./value-objects/proxy-setting-device-name";

export class ProxySettingDeviceEntity extends BaseEntity<ProxySettingDeviceIdentity> {
    constructor(
        identity: ProxySettingDeviceIdentity,
        public name: ProxySettingDeviceName,
        private hardwarePort: ProxySettingDeviceHardwarePort,
        public enabled: boolean,
    ) {
        super(identity);
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
            () => networksetupProxy.setwebproxy(this.name.value, NETWORK_HOST_NAME, String(PROXY_PORT)),
            () => networksetupProxy.setsecurewebproxy(this.name.value, NETWORK_HOST_NAME, String(PROXY_PORT)),
            true
        );
    }

    async disableProxy(): Promise<void> {
        if (!this.enabled) return;
        if (!(await this.isProxing())) return;

        return ChangeProxyCommand(
            this,
            () => networksetupProxy.setwebproxystate(this.name.value, 'off'),
            () => networksetupProxy.setsecurewebproxystate(this.name.value, 'off'),
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
