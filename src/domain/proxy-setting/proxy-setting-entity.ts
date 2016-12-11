import {Entity} from "typescript-dddbase";
import {ProxySettingIdentity} from "./proxy-setting-identity";
import {ProxySettingDevices} from "./proxy-setting-devices";
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

    private grantProxy() {
        return execGrantNetworkCommand().then(({stdout, stderr}: IOResult) => {
            if (stderr) {
                throw new Error(stderr);
            }
            return true;
        })
    }

    private enableProxy() {
        let param = `${NETWORK_HOST_NAME} ${PROXY_PORT}`;
        let _enableProxy = (setCommand: string, getCommand: string) => {
            return this.execAllDevices((device) => {
                return new Promise((resolve, reject) => {
                    let exec = (count: number) => {
                        if (!count) {
                            reject();
                        }
                        execSuNetworkCommand([`-${setCommand} "${device}" ${param}`]).then(() => {
                            execNetworkCommand([`-${getCommand} "${device}"`]).then(({stdout, stderr}: IOResult) => {
                                let result = this.isProxing(stdout);
                                if (result) {
                                    return resolve();
                                }
                                setTimeout(() => {
                                    exec(count--)
                                }, 100);
                            });
                        });
                    };
                    exec(3);
                });
            });
        };
        return Promise.all([
            _enableProxy('setwebproxy', 'getwebproxy'),
            _enableProxy('setsecurewebproxy', 'getsecurewebproxy'),
        ]);
    }

    private hasProxy() {
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

    private isProxing(stdout: string): boolean {
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

    private disableProxy() {
        let _disableProxy = (setCommand: string, getCommand: string) => {
            return this.execAllDevices((device) => {
                return new Promise((resolve, reject) => {
                    let exec = (count: number) => {
                        if (!count) {
                            reject();
                        }
                        execSuNetworkCommand([`-${setCommand} "${device}" off`]).then(() => {
                            execNetworkCommand([`-${getCommand} "${device}"`]).then(({stdout, stderr}: IOResult) => {
                                let result = this.isProxing(stdout);
                                if (!result) {
                                    return resolve();
                                }
                                setTimeout(() => {
                                    exec(count--)
                                }, 100);
                            });
                        });
                    };
                    exec(3);
                });
            });
        };
        return Promise.all([
            _disableProxy('setwebproxystate', 'getwebproxy'),
            _disableProxy('setsecurewebproxystate', 'getsecurewebproxy'),
        ]);
    }

    private execAllDevices(exec: (device: string) => any) {
        let promises = this.devices.map((device: string) => exec(device));
        return promises.reduce((base, cur) => {
            return base.then(cur);
        }, Promise.resolve());
    }
}