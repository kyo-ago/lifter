import {execNetworkCommand, IOResult, execSuNetworkCommand} from "../../libs/execCommand";

export class ProxySettingService {
    enableProxy() {
        return execNetworkCommand([`-listallnetworkservices`]).then(({stdout, stderr}: IOResult) => {
            if (stderr) {
                return Promise.reject(stderr);
            }
            let devices = stderr.split(/\r?\n/);
            devices.shift();
            return Promise.resolve(devices);
        }).then((devices) => {
            return Promise.all(devices.map((device) => execSuNetworkCommand([`-setwebproxy ${device} localhost 8000`])));
        });
    }
    disableProxy() {
    }
}
