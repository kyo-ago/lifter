import {execNetworkCommand, execSuNetworkCommand, IOResult} from "../../libs/execCommand";
import {PROXY_PORT} from "../settings";

export class ProxySettingService {
    hasProxy() {
        return this.getNetworkDevices().then((devices) => {
            return Promise.all(devices.map((device) => {
                return execNetworkCommand([`-getwebproxy ${device}`]).then(({stdout, stderr}: IOResult) => {
                    let result: any = stdout.split(/\r?\n/).reduce((base: any, cur: string) => {
                        let [key, val] = cur.split(/\s*:\s*/);
                        base[key.toLowerCase()] = val;
                        return base;
                    }, {});
                    if (result['enabled'] !== 'Yes') {
                        return false;
                    }
                    if (result['server'] !== '127.0.0.1') {
                        return false;
                    }
                    if (result['port'] !== String(PROXY_PORT)) {
                        return false;
                    }
                    return true;
                });
            })).then((results) => {
                return results.find((result) => !result);
            });
        });
    }

    enableProxy() {
        return this.getNetworkDevices().then((devices) => {
            return Promise.all(devices.map((device) => {
                return execSuNetworkCommand([`-setwebproxy ${device} localhost ${PROXY_PORT}`]);
            }));
        });
    }

    disableProxy() {
        return this.getNetworkDevices().then((devices) => {
            return Promise.all(devices.map((device) => {
                return execSuNetworkCommand([`-setwebproxystate ${device} off`]);
            }));
        });
    }

    private getNetworkDevices(): Promise<string[]> {
        return execNetworkCommand([`-listallnetworkservices`]).then(({stdout, stderr}: IOResult) => {
            if (stderr) {
                return Promise.reject(stderr);
            }
            let devices = stdout.split(/\r?\n/);
            devices.shift();
            return Promise.resolve(devices);
        });
    }
}
