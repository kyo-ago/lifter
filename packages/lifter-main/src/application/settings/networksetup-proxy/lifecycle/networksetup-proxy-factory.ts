import { APPLICATION_NAME } from "@lifter/lifter-common";
import { NetworksetupProxy } from "@lifter/networksetup-proxy";
import * as fs from "fs";
import { DEVELOP_PROXY_SETTING_COMMAND_PATH, PRODUCTION_PROXY_SETTING_COMMAND_PATH } from "../../../../settings";

export class NetworksetupProxyFactory {
    private networksetupProxy: NetworksetupProxy;

    async load() {
        let path = await this.getCommandPath();
        this.networksetupProxy = new NetworksetupProxy(`${APPLICATION_NAME} sudo prompt`, path);
    }

    getNetworksetupProxy() {
        return this.networksetupProxy;
    }

    private async getCommandPath(): Promise<string> {
        let fsExists = (path: string) => new Promise(resolve => fs.exists(path, resolve));
        if (await fsExists(DEVELOP_PROXY_SETTING_COMMAND_PATH)) {
            return DEVELOP_PROXY_SETTING_COMMAND_PATH;
        }
        if (await fsExists(PRODUCTION_PROXY_SETTING_COMMAND_PATH)) {
            return PRODUCTION_PROXY_SETTING_COMMAND_PATH;
        }
        throw new Error("Missing networksetup-proxy command");
    }
}
