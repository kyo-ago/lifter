export const PROXY_PORT = 8888;
export const IFCONFIG_COMMAND = "/sbin/ifconfig";
export const NETWORK_SETUP_COMMAND = "/usr/sbin/networksetup";
export const NETWORK_HOST_NAME = "localhost";
export const BIND_HOST_NAME = "127.0.0.1";
export const SECURITY_COMMAND = "/usr/bin/security";
export const HTTP_SSL_CA_DIR_NAME = `http-mitm-proxy`;
export const PROXY_SERVER_NAME = `${NETWORK_HOST_NAME}:${PROXY_PORT}`;
export const LOCAL_PAC_FILE_URL = new RegExp(
    `^http://${NETWORK_HOST_NAME}|${BIND_HOST_NAME}:${PROXY_PORT}/proxy\.pac$`,
);
export const PROXY_PREFERENCES_PLIST_PATH =
    "/Library/Preferences/SystemConfiguration/preferences.plist";

export const PRODUCTION_PROXY_SETTING_COMMAND_PATH = __dirname.replace(
    /app\.asar\/.+/,
    `app.asar.unpacked/node_modules/@lifter/networksetup-proxy/rust/proxy-setting`,
);
export const DEVELOP_PROXY_SETTING_COMMAND_PATH =
    "./node_modules/@lifter/networksetup-proxy/rust/proxy-setting";

export const CERTIFICATE_NAME = `NodeMITMProxyCA`;
