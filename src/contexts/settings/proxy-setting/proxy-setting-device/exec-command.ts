import * as execa from "execa";
import {throwableCommand} from "../../../../libs/throwable-command";
import {NETWORK_SETUP_COMMAND} from "../../../../settings";
import {ProxySettingDeviceEntity} from "./proxy-setting-device-entity";

export class ExecCommand {
    static getListnetworkserviceorder(): Promise<string> {
        return throwableCommand(execa(NETWORK_SETUP_COMMAND, ['-listnetworkserviceorder']));
    }

    static getSecureWebproxy(device: ProxySettingDeviceEntity): Promise<string> {
        return throwableCommand(execa(NETWORK_SETUP_COMMAND, ['-getsecurewebproxy', device.hardwarePort]));
    }

    static getWebproxy(device: ProxySettingDeviceEntity): Promise<string> {
        return throwableCommand(execa(NETWORK_SETUP_COMMAND, ['-getwebproxy', device.hardwarePort]));
    }
}
