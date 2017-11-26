"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const micromatch = require("micromatch");
const Path = require("path");
const auto_responder_entry_pattern_1 = require("../../value-objects/auto-responder-entry-pattern");
class AutoResponderEntryGlobPattern extends auto_responder_entry_pattern_1.AutoResponderEntryPattern {
    constructor(pattern) {
        super(pattern);
        this.matchRegexp = micromatch.makeRe(pattern);
    }
    getMatchCodeString(proxyConnect) {
        // similar matchBase option
        let regexp = String(this.matchRegexp)
            .replace(/^\/\^/, "/")
            .replace(/\$\/$/, "/");
        return `
            if ((${regexp}).test(url)) {
                return "${proxyConnect}";
            }
        `;
    }
    isMatchPath(clientRequestEntity) {
        let href = clientRequestEntity.href;
        // similar matchBase option
        return this.matchRegexp.test(href) || this.matchRegexp.test(Path.basename(href));
    }
}
exports.AutoResponderEntryGlobPattern = AutoResponderEntryGlobPattern;
