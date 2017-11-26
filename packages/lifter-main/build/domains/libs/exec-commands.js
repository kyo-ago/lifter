"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const execa = require("execa");
const settings_1 = require("../../settings");
const throwable_command_1 = require("./throwable-command");
function ExecCommand(commandPath, args) {
    let filteredArgs = args.filter(arg => arg).map(arg => (arg.match(/\W/) ? `"${arg}"` : arg));
    return throwable_command_1.throwableCommand(execa.shell(`${commandPath} ${filteredArgs.join(" ")}`));
}
function getListnetworkserviceorder() {
    return ExecCommand(settings_1.NETWORK_SETUP_COMMAND, ["-listnetworkserviceorder"]);
}
exports.getListnetworkserviceorder = getListnetworkserviceorder;
function getWebproxy(device) {
    return ExecCommand(settings_1.NETWORK_SETUP_COMMAND, ["-getwebproxy", device.serviceName]);
}
exports.getWebproxy = getWebproxy;
function getSecureWebproxy(device) {
    return ExecCommand(settings_1.NETWORK_SETUP_COMMAND, ["-getsecurewebproxy", device.serviceName]);
}
exports.getSecureWebproxy = getSecureWebproxy;
function getProxyByPassDomains(device) {
    return ExecCommand(settings_1.NETWORK_SETUP_COMMAND, ["-getproxybypassdomains", device.serviceName]);
}
exports.getProxyByPassDomains = getProxyByPassDomains;
function findCertificate(certificateName) {
    return ExecCommand(settings_1.SECURITY_COMMAND, ["find-certificate", "-c", certificateName]);
}
exports.findCertificate = findCertificate;
function deleteCertificate(certificateName) {
    return ExecCommand(settings_1.SECURITY_COMMAND, ["delete-certificate", "-c", certificateName]);
}
exports.deleteCertificate = deleteCertificate;
function importCert(certificatePath) {
    return ExecCommand(settings_1.SECURITY_COMMAND, ["import", certificatePath]);
}
exports.importCert = importCert;
function addTrustedCert(certificatePath) {
    return ExecCommand(settings_1.SECURITY_COMMAND, ["add-trusted-cert", "-p", "ssl", certificatePath]);
}
exports.addTrustedCert = addTrustedCert;
