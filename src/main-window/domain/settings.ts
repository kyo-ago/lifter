import * as fs from "fs";

export const PROXY_PORT = 8888;
export const APPLICATION_NAME = require('../../../package.json').build.productName;
export const NETWORK_SETUP_COMMAND = '/usr/sbin/networksetup';
export const NETWORK_HOST_NAME = 'localhost';
export const SECURITY_COMMAND = '/usr/bin/security';
export const SETTING_FILE_NAME = 'lifterProxy.conf.js';
export const DATA_STORE_FILENAME = 'lifterProxy.save.db';
export const HTTP_SSL_CA_DIR_PATH = '.http-mitm-proxy';

let production = __dirname.replace(/app\.asar\/.+/, `app.asar.unpacked/node_modules/networksetup-proxy/rust/proxy-setting`);
let staging = './node_modules/networksetup-proxy/rust/proxy-setting';
let path = fs.existsSync(production)
    ? production
    : (
        fs.existsSync(staging)
            ? staging
            : undefined
    )
;
if (!path) {
    throw new Error('Missing networksetup-proxy command');
}
export const NETWORK_SETUP_PROXY_COMMAND = path;
