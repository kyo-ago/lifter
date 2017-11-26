"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROXY_PORT = 8888;
exports.NETWORK_SETUP_COMMAND = "/usr/sbin/networksetup";
exports.NETWORK_HOST_NAME = "localhost";
exports.SECURITY_COMMAND = "/usr/bin/security";
exports.APPLICATION_NAME = "Lifter Proxy";
exports.PROXY_SERVER_NAME = `${exports.NETWORK_HOST_NAME}:${exports.PROXY_PORT}`;
exports.LOCAL_PAC_FILE_URL = `http://${exports.PROXY_SERVER_NAME}/proxy.pac`;
exports.PRODUCTION_PROXY_SETTING_COMMAND_PATH = __dirname.replace(
    /app\.asar\/.+/,
    `app.asar.unpacked/node_modules/networksetup-proxy/rust/proxy-setting`
);
exports.DEVELOP_PROXY_SETTING_COMMAND_PATH = "./node_modules/networksetup-proxy/rust/proxy-setting";
