import {NetworksetupProxy} from "networksetup-proxy";
import {NETWORK_SETUP_PROXY_COMMAND} from "../../../contexts/proxy/settings";
import {APPLICATION_NAME} from "../../../settings";

export const networksetupProxy = new NetworksetupProxy(`${APPLICATION_NAME} sudo prompt`, NETWORK_SETUP_PROXY_COMMAND);
