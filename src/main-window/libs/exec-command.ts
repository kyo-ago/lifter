import * as execa from "execa";
import {ProxySettingDevice} from "../domain/proxy-setting/value-objects/proxy-setting-device";
import {NETWORK_SETUP_COMMAND, SECURITY_COMMAND} from "../domain/settings";
import {throwableCommand} from "./throwable-command";

export interface IOResult {
    stdout: string;
    stderr: string;
}

export function execSecurityCommand(param: string[]) {
    return execa(SECURITY_COMMAND, param);
}

export function getListnetworkserviceorder(): Promise<string> {
    return throwableCommand(execa(NETWORK_SETUP_COMMAND, [`-listnetworkserviceorder`]));
}

export function getWebproxy(device: ProxySettingDevice): Promise<string> {
    return throwableCommand(execa(NETWORK_SETUP_COMMAND, [`-getwebproxy "${device.value}"`]));
}

export function getSecureWebproxy(device: ProxySettingDevice): Promise<string> {
    return throwableCommand(execa(NETWORK_SETUP_COMMAND, [`-getsecurewebproxy "${device.value}"`]));
}
