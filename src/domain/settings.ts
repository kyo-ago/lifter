export const PROXY_PORT = 8888;
export const NETWORK_SETUP_COMMAND = '/usr/sbin/networksetup';
export const NETWORK_HOST_NAME = 'localhost';
export const SECURITY_COMMAND = '/usr/bin/security';
export const SETTING_FILE_NAME = 'lifterProxy.conf.js';
export const DATA_STORE_FILENAME = 'lifterProxy.save.db';
export const HTTP_SSL_CA_DIR_PATH = '.http-mitm-proxy';
let path = __dirname.replace(/app\.asar\/.+/, `app.asar.unpacked/node_modules/networksetup-proxy/rust/proxy-setting`);
export const NETWORK_SETUP_PROXY_COMMAND = path;
