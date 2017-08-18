import * as execa from "execa";
import {ProxySettingDeviceEntity} from "../domain/proxy-setting/proxy-setting-device/proxy-setting-device-entity";
import {NETWORK_SETUP_COMMAND, SECURITY_COMMAND} from "../domain/settings";
import {throwableCommand} from "./throwable-command";

export interface IOResult {
    stdout: string;
    stderr: string;
}

export function execSecurityCommand(param: string[]) {
    return execa(SECURITY_COMMAND, param);
}

export class ExecCommand {
    static getListnetworkserviceorder(): Promise<string> {
        return throwableCommand(execa(NETWORK_SETUP_COMMAND, [`-listnetworkserviceorder`]));
    }

    static getSecureWebproxy(device: ProxySettingDeviceEntity): Promise<string> {
        return throwableCommand(execa(NETWORK_SETUP_COMMAND, [`-getsecurewebproxy "${device.name}"`]));
    }

    static getWebproxy(device: ProxySettingDeviceEntity): Promise<string> {
        return throwableCommand(execa(NETWORK_SETUP_COMMAND, [`-getwebproxy "${device.name}"`]));
    }
}
