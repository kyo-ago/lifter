import * as execa from "execa";
import {ProxySettingDeviceEntity} from "../domain/proxy-setting/proxy-setting-device/proxy-setting-device-entity";
import {NETWORK_SETUP_COMMAND, SECURITY_COMMAND} from "../domain/settings";
import {throwableCommand} from "./throwable-command";

export class ExecCommand {
    static findCertificate(certificateName: string) {
        return throwableCommand(execa(SECURITY_COMMAND, ['find-certificate', '-c', certificateName]));
    }

    static deleteCertificate(certificateName: string) {
        return throwableCommand(execa(SECURITY_COMMAND, ['delete-certificate', '-c', certificateName]));
    }

    static addTrustedCert(certificatePath: string): Promise<string> {
        return throwableCommand(execa(SECURITY_COMMAND, ['add-trusted-cert', certificatePath]));
    }

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
