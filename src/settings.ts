import {app} from 'electron';

// app === undefined is test env(node)
let userDataPath = app ? app.getPath('userData') : '.';

export const PROXY_PORT = 8888;
export const BIND_HOST_NAME = '127.0.0.1';
export const NETWORK_SETUP_COMMAND = '/usr/sbin/networksetup';
export const NETWORK_HOST_NAME = 'localhost';
export const SECURITY_COMMAND = '/usr/bin/security';
export const HTTP_SSL_CA_DIR_PATH = `${userDataPath}/http-mitm-proxy`;
export const REPOSITORY_BASE_DIR_PATH = `${userDataPath}/Repositories`;
export const APPLICATION_NAME = 'Lifter Proxy';
export const WINDOW_STATE_DIR = 'WindowStates/';
export const LOCAL_PAC_FILE_URL = `http://localhost:${PROXY_PORT}/proxy.pac`;
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
