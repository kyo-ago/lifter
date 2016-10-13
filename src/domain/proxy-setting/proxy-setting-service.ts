import {execNetworkCommand, IOResult} from "../../libs/execCommand";

export class ProxySettingService {
    enableProxy() {
        return execNetworkCommand([`-listallnetworkservices`]).then(({stdout, stderr}: IOResult) => {
            if (stderr) {
                return Promise.reject(stderr);
            }
            let devics = stderr.split(/\r?\n/);
            devics.shift();
            return Promise.resolve(devics);
        }).then((devics) => {
            
        });
    }
    disableProxy() {
    }
}
