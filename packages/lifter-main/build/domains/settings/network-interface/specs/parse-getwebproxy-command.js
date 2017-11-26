"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const settings_1 = require("../../../../settings");
function ParseGetwebproxyCommand(stdout) {
    let result = stdout
        .trim()
        .split(/\r?\n/)
        .reduce((base, cur) => {
            let [key, val] = cur.split(/:/);
            base[key.trim()] = val.trim();
            return base;
        }, {});
    if (result.Enabled !== "Yes") {
        return false;
    }
    if (result.Server !== settings_1.NETWORK_HOST_NAME) {
        return false;
    }
    if (result.Port !== String(settings_1.PROXY_PORT)) {
        return false;
    }
    return true;
}
exports.ParseGetwebproxyCommand = ParseGetwebproxyCommand;
