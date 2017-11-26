"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function GetMatchPathCodeString(proxyConnect, pattern_) {
    let pattern = pattern_.replace(/\\/g, "\\").replace(/"/g, '\\"');
    return `
            if (~url.indexOf("${pattern}")) {
                return "${proxyConnect}";
            }
        `;
}
exports.GetMatchPathCodeString = GetMatchPathCodeString;
