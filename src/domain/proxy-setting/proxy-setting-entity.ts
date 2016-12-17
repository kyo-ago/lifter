import {Entity} from "typescript-dddbase";
import {ProxySettingIdentity} from "./proxy-setting-identity";
import {ProxySettingDevices} from "./value-objects/proxy-setting-devices";
import {execGrantNetworkCommand, IOResult, execSuNetworkCommand, execNetworkCommand} from "../../libs/exec-command";
import {PROXY_PORT, NETWORK_HOST_NAME} from "../settings";
import {ProxySettingStatus} from "./proxy-setting-service";

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

    getCurrentStatus() {
        return new Promise<ProxySettingStatus>((resolve, reject) => {
            if (!this.isGranted) {
                return resolve("NoPermission");
            }
            this.hasProxy().then((result: boolean) => {
                resolve(result ? "On" : "Off");
            });
        });
    }

    getNewStatus() {
        return new Promise<ProxySettingStatus>((resolve, reject) => {
            if (!this.isGranted) {
                this.grantProxy().then(() => {
                    this.hasProxy().then((result: boolean) => {
                        resolve(result ? "On" : "Off");
                    });
                });
                return;
            }
            this.hasProxy().then((result: boolean) => {
                if (result) {
                    this.disableProxy().then(() => {
                        resolve("Off");
                    });
                } else {
                    this.enableProxy().then(() => {
                        resolve("On");
                    });
                }
            });
        });
    }

    grantProxy() {
        return execGrantNetworkCommand().then(({stdout, stderr}: IOResult) => {
            if (stderr) {
                throw new Error(stderr);
            }
            return true;
        })
    }

    hasProxy() {
        return Promise.all(this.devices.map((device) => {
            return Promise.all([
                execNetworkCommand([`-getwebproxy "${device}"`]),
                execNetworkCommand([`-getsecurewebproxy "${device}"`]),
            ]).then((results: IOResult[]) => {
                return results.find(({stdout, stderr}: IOResult) => {
                    return this.isProxing(stdout);
                });
            });
        })).then((results) => {
            return !!results.find((result) => !!result);
        });
    }

    isProxing(stdout: string): boolean {
        let result = stdout.trim().split(/\r?\n/).reduce((base: any, cur: string) => {
            let [key, val] = cur.split(/:/);
            base[key.trim()] = val.trim();
            return base;
        }, <{
            Enabled: "Yes" | "No";
            Server: string;
            Port: string;
            "Authenticated Proxy Enabled": string;
        }>{});

        if (result.Enabled !== 'Yes') {
            return false;
        }
        if (result.Server !== NETWORK_HOST_NAME) {
            return false;
        }
        if (result.Port !== String(PROXY_PORT)) {
            return false;
        }
        return true;
    }

    enableProxy() {
        return Promise.all([
            this.changeProxy('setwebproxy', `${NETWORK_HOST_NAME} ${PROXY_PORT}`, 'getwebproxy', true),
            this.changeProxy('setsecurewebproxy', `${NETWORK_HOST_NAME} ${PROXY_PORT}`, 'getsecurewebproxy', true),
        ]);
    }

    disableProxy() {
        return Promise.all([
            this.changeProxy('setwebproxystate', 'off', 'getwebproxy', false),
            this.changeProxy('setsecurewebproxystate', 'off', 'getsecurewebproxy', false),
        ]);
    }

    private changeProxy(setCommand: string, setParam: string, getCommand: string, result: boolean) {
        return this.execAllDevices((device) => {
            return new Promise((resolve, reject) => {
                let exec = (count: number) => {
                    if (!count) {
                        reject();
                    }
                    execSuNetworkCommand([`-${setCommand} "${device}" ${setParam}`]).then(() => {
                        return execNetworkCommand([`-${getCommand} "${device}"`]).then(({stdout, stderr}: IOResult) => {
                            if (this.isProxing(stdout) === result) {
                                return resolve();
                            }
                            setTimeout(() => {
                                exec(count--)
                            }, 100);
                        });
                    }).catch(reject);
                };
                exec(3);
            });
        });
    }

    private execAllDevices(exec: (device: string) => any) {
        let promises = this.devices.map((device: string) => exec(device));
        return promises.reduce((base, cur) => {
            return base.then(cur);
        }, Promise.resolve());
    }
}