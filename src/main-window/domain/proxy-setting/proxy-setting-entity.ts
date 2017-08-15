import {BaseEntity} from "../../../share/domain/base/base-entity";
import {ProxySettingStatus} from "../../application/proxy-setting/proxy-setting-service";
import {networksetupProxy} from "../../libs/networksetup-proxy-command";
import {throwableCommand} from "../../libs/throwable-command";
import {ProxySettingIdentity} from "./proxy-setting-identity";
import {ProxySettingDevice} from "./value-objects/proxy-setting-device";

export class ProxySettingEntity extends BaseEntity<ProxySettingIdentity> {
    constructor(
        identity: ProxySettingIdentity,
        private devices: ProxySettingDevice[],
        public isGranted: boolean,
    ) {
        super(identity);
    }

    async getCurrentStatus(): Promise<ProxySettingStatus> {
        if (!this.isGranted) {
            throw new Error("NoPermission");
        }
        return (await this.hasProxy()) ? "On" : "Off";
    }

    async getNewStatus(): Promise<ProxySettingStatus> {
        if (!this.isGranted) {
            await this.grantProxy();
            return (await this.hasProxy()) ? "On" : "Off";
        }

        if (await this.hasProxy()) {
            await this.disableProxy();
            return "Off";
        } else {
            await this.enableProxy();
            return "On";
        }
    }

    async grantProxy() {
        await throwableCommand(networksetupProxy.grant());
        return true;
    }

    async hasProxy(): Promise<boolean> {
        let results = await Promise.all(this.devices.map((device) => device.hasProxy()));
        return results.find((result) => result);
    }

    enableProxy() {
        return Promise.all(this.devices.map((device) => device.enableProxy()));
    }

    disableProxy() {
        return Promise.all(this.devices.map((device) => device.disableProxy()));
    }
}