import {NetworksetupProxy} from "networksetup-proxy";
import {APPLICATION_NAME, NETWORK_SETUP_PROXY_COMMAND} from "../domain/settings";

let networksetupProxy = new NetworksetupProxy(`${APPLICATION_NAME} sudo prompt`, NETWORK_SETUP_PROXY_COMMAND);
export const networksetupProxy;
