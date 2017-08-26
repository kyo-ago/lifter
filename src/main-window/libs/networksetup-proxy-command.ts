import {NetworksetupProxy} from "networksetup-proxy";
import {NETWORK_SETUP_PROXY_COMMAND} from "../domain/settings";
import {APPLICATION_NAME} from "../../settings";

export const networksetupProxy = new NetworksetupProxy(`${APPLICATION_NAME} sudo prompt`, NETWORK_SETUP_PROXY_COMMAND);
