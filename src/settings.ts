export const PROXY_PORT = 8888;
export const NETWORK_SETUP_COMMAND = '/usr/sbin/networksetup';
export const NETWORK_HOST_NAME = 'localhost';
export const SECURITY_COMMAND = '/usr/bin/security';
export const HTTP_SSL_CA_DIR_PATH = './.http-mitm-proxy';

export const APPLICATION_NAME = 'Lifter Proxy';
export const WindowManagerInit = {
    appBase: `file://${__dirname}`,
    defaultSetup: {
        defaultWidth: 1000,
        defaultHeight: 800,
        acceptFirstMouse: true,
    },
};

export const PRODUCTION_PROXY_SETTING_COMMAND_PATH = __dirname
    .replace(
        /app\.asar\/.+/,
        `app.asar.unpacked/node_modules/networksetup-proxy/rust/proxy-setting`
    )
;
export const DEVELOP_PROXY_SETTING_COMMAND_PATH = './node_modules/networksetup-proxy/rust/proxy-setting';
