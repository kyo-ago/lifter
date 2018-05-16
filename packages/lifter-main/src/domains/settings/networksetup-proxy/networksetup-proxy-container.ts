import { APPLICATION_NAME } from "@lifter/lifter-common";
import { NetworksetupProxy } from "@lifter/networksetup-proxy";
import { injectable } from "inversify";
import { ProxyCommandPath } from "../../../libs/proxy-command-path";

@injectable()
export class NetworksetupProxyContainer {
    private readonly networksetupProxy: NetworksetupProxy;

    constructor(proxyCommandPath: ProxyCommandPath) {
        this.networksetupProxy = new NetworksetupProxy(
            `${APPLICATION_NAME} sudo prompt`,
            proxyCommandPath.value,
        );
    }

    getComand() {
        return this.networksetupProxy;
    }
}
