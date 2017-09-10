import * as fs from "fs";
import {NetworksetupProxy} from "networksetup-proxy";
import {
    APPLICATION_NAME,
    DEVELOP_PROXY_SETTING_COMMAND_PATH,
    PRODUCTION_PROXY_SETTING_COMMAND_PATH
} from "../../../settings";

let path = fs.existsSync(DEVELOP_PROXY_SETTING_COMMAND_PATH)
    ? DEVELOP_PROXY_SETTING_COMMAND_PATH
    : (
        fs.existsSync(PRODUCTION_PROXY_SETTING_COMMAND_PATH)
            ? PRODUCTION_PROXY_SETTING_COMMAND_PATH
            : undefined
    )
;
if (!path) {
    throw new Error('Missing networksetup-proxy command');
}

export const networksetupProxy = new NetworksetupProxy(`${APPLICATION_NAME} sudo prompt`, path);
