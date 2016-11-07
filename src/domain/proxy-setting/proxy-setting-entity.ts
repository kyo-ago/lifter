import {Entity} from "typescript-dddbase";
import {ProxySettingIdentity} from "./proxy-setting-identity";
import {ProxySettingDevices} from "./proxy-setting-devices";
import {execGrantNetworkCommand, IOResult, execSuNetworkCommand, execNetworkCommand} from "../../libs/exec-command";
import {PROXY_PORT, NETWORK_HOST_NAME} from "../settings";

export class ProxySettingEntity extends Entity<ProxySettingIdentity> {
    constructor(
        identity: ProxySettingIdentity,
        private _devices: ProxySettingDevices,
        public isGranted: boolean,
    ) {
        super(identity);
    }

    get id() {
        return this.getIdentity().getValue();
    }

    get devices() {
        return this._devices.value;
    }

    grantProxy() {
        return execGrantNetworkCommand().then(({stdout, stderr}: IOResult) => {
            if (stderr) {
                throw new Error(stderr);
            }
            return true;
        })
    }

    enableProxy() {
        return this.execAllDevices((device) => execSuNetworkCommand([`-setwebproxy "${device}" ${NETWORK_HOST_NAME} ${PROXY_PORT}`]));
    }

    hasProxy() {
        return Promise.all(this.devices.map((device) => {
            return execNetworkCommand([`-getwebproxy "${device}"`]).then(({stdout, stderr}: IOResult) => {
                let result: any = stdout.split(/\r?\n/).reduce((base: any, cur: string) => {
                    let [key, val] = cur.split(/\s*:\s*/);
                    base[key.toLowerCase()] = val;
                    return base;
                }, {});
                if (result['enabled'] !== 'Yes') {
                    return false;
                }
                if (result['server'] !== NETWORK_HOST_NAME) {
                    return false;
                }
                if (result['port'] !== String(PROXY_PORT)) {
                    return false;
                }
                return true;
            });
        })).then((results) => {
            return results.find((result) => !result) === undefined;
        });
    }

    disableProxy() {
        return this.execAllDevices((device) => execSuNetworkCommand([`-setwebproxystate "${device}" off`]));
    }

    private execAllDevices(exec: (device: string) => Promise<IOResult>) {
        return Promise.all(this.devices.map(exec)).then((results: IOResult[]) => {
            return !results.filter((result) => result.stdout || result.stderr).length;
        });
    }
}