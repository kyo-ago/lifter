import * as execa from "execa";
import { NETWORK_SETUP_COMMAND, SECURITY_COMMAND } from "../settings";
import { NetworkInterfaceEntity } from "../domains/settings/network-interface/network-interface-entity";
import { throwableCommand } from "./throwable-command";

function ExecCommand(commandPath: string, args: string[]) {
    let filteredArgs = args.filter(arg => arg).map(arg => (arg.match(/\W/) ? `"${arg}"` : arg));
    return throwableCommand(execa.shell(`${commandPath} ${filteredArgs.join(" ")}`));
}

export function getListnetworkserviceorder() {
    return ExecCommand(NETWORK_SETUP_COMMAND, ["-listnetworkserviceorder"]);
}

export function getWebproxy(device: NetworkInterfaceEntity) {
    return ExecCommand(NETWORK_SETUP_COMMAND, ["-getwebproxy", device.serviceName]);
}

export function getSecureWebproxy(device: NetworkInterfaceEntity) {
    return ExecCommand(NETWORK_SETUP_COMMAND, ["-getsecurewebproxy", device.serviceName]);
}

export function getProxyByPassDomains(device: NetworkInterfaceEntity) {
    return ExecCommand(NETWORK_SETUP_COMMAND, ["-getproxybypassdomains", device.serviceName]);
}

export function findCertificate(certificateName: string) {
    return ExecCommand(SECURITY_COMMAND, ["find-certificate", "-c", certificateName]);
}

export function importCert(certificatePath: string): Promise<string> {
    return ExecCommand(SECURITY_COMMAND, ["import", certificatePath]);
}
