import * as execa from "execa";
import {ProxySettingDeviceEntity} from "../contexts/settings/proxy-setting/proxy-setting-device/proxy-setting-device-entity";
import {NETWORK_SETUP_COMMAND, SECURITY_COMMAND} from "../settings";
import {throwableCommand} from "./throwable-command";

function ExecCommand(commandPath: string, args: string[]) {
    return throwableCommand(execa.shell(`${commandPath} "${args.map((arg) => (arg || '').replace(/["\\]/g, '\\$&')).join('" "')}"`));
}

export function getListnetworkserviceorder() {
    return ExecCommand(NETWORK_SETUP_COMMAND, ['-listnetworkserviceorder']);
}

export function getWebproxy(device: ProxySettingDeviceEntity) {
    return ExecCommand(NETWORK_SETUP_COMMAND, ['-getwebproxy', device.hardwarePort]);
}

export function getSecureWebproxy(device: ProxySettingDeviceEntity) {
    return ExecCommand(NETWORK_SETUP_COMMAND, ['-getsecurewebproxy', device.hardwarePort]);
}

export function findCertificate(certificateName: string) {
    return ExecCommand(SECURITY_COMMAND, ['find-certificate', '-c', certificateName]);
}

export function deleteCertificate(certificateName: string) {
    return ExecCommand(SECURITY_COMMAND, ['delete-certificate', '-c', certificateName]);
}

export function addTrustedCert(certificatePath: string): Promise<string> {
    return ExecCommand(SECURITY_COMMAND, ['add-trusted-cert', certificatePath]);
}
