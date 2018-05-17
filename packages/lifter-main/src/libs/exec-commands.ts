import * as execa from "execa";
import { NetworkInterfaceEntity } from "../domains/settings/network-interface/network-interface-entity";
import {
    CERTIFICATE_NAME,
    IFCONFIG_COMMAND,
    NETWORK_SETUP_COMMAND,
    SECURITY_COMMAND,
} from "../settings";
import { throwableCommand } from "./throwable-command";

function ExecCommand(commandPath: string, args: string[]): Promise<string> {
    let commandString = GetCommandString(commandPath, args);
    return ExecCommandFromString(commandString);
}

function ExecCommandFromString(commandString: string): Promise<string> {
    return throwableCommand(execa.shell(commandString));
}

function GetCommandString(commandPath: string, args: string[]): string {
    let filteredArgs = args
        .filter(arg => arg)
        .map(arg => (arg.match(/\W/) ? `"${arg}"` : arg));
    return `${commandPath} ${filteredArgs.join(" ")}`;
}

export function getIfconfig(): Promise<string> {
    return ExecCommand(IFCONFIG_COMMAND, []);
}

export function getListnetworkserviceorder(): Promise<string> {
    return ExecCommand(NETWORK_SETUP_COMMAND, ["-listnetworkserviceorder"]);
}

export function getWebproxy(device: NetworkInterfaceEntity): Promise<string> {
    return ExecCommand(NETWORK_SETUP_COMMAND, [
        "-getwebproxy",
        device.serviceName,
    ]);
}

export function getSecureWebproxy(
    device: NetworkInterfaceEntity,
): Promise<string> {
    return ExecCommand(NETWORK_SETUP_COMMAND, [
        "-getsecurewebproxy",
        device.serviceName,
    ]);
}

export function getProxyByPassDomains(
    device: NetworkInterfaceEntity,
): Promise<string> {
    return ExecCommand(NETWORK_SETUP_COMMAND, [
        "-getproxybypassdomains",
        device.serviceName,
    ]);
}

export function getAutoproxyurl(device: NetworkInterfaceEntity): Promise<string> {
    return ExecCommand(NETWORK_SETUP_COMMAND, ["-getautoproxyurl", device.serviceName,]);
}

export function findCertificate(): Promise<string> {
    return ExecCommand(SECURITY_COMMAND, [
        "find-certificate",
        "-c",
        CERTIFICATE_NAME,
    ]);
}

export function deleteCertificate(): Promise<string> {
    let commandString = getDeleteCertificateCommandString();
    return ExecCommandFromString(commandString);
}

export function getDeleteCertificateCommandString(): string {
    return GetCommandString(SECURITY_COMMAND, [
        "delete-certificate",
        "-c",
        CERTIFICATE_NAME,
    ]);
}

export function importCert(certificatePath: string): Promise<string> {
    let commandString = getImportCertCommandString(certificatePath);
    return ExecCommandFromString(commandString);
}

export function getImportCertCommandString(certificatePath: string): string {
    return GetCommandString(SECURITY_COMMAND, ["import", certificatePath]);
}

export function addTrustedCert(certificatePath: string): Promise<string> {
    let commandString = getAddTrustedCertCommandString(certificatePath);
    return ExecCommandFromString(commandString);
}

export function getAddTrustedCertCommandString(
    certificatePath: string,
): string {
    return GetCommandString(SECURITY_COMMAND, [
        "add-trusted-cert",
        "-p",
        "ssl",
        certificatePath,
    ]);
}
