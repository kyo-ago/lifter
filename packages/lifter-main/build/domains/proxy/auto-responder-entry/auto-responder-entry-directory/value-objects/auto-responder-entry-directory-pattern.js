"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_match_path_code_string_1 = require("../../lib/get-match-path-code-string");
const auto_responder_entry_pattern_1 = require("../../value-objects/auto-responder-entry-pattern");
class AutoResponderEntryDirectoryPattern extends auto_responder_entry_pattern_1.AutoResponderEntryPattern {
    static createSafeValue(pattern) {
        return new AutoResponderEntryDirectoryPattern(pattern.replace(/[^\/]$/, "$&/"));
    }
    getMatchCodeString(proxyConnect) {
        return get_match_path_code_string_1.GetMatchPathCodeString(proxyConnect, this.value);
    }
    isMatchPath(clientRequestEntity) {
        let splitted = clientRequestEntity.pathname.split(this.value);
        // unmatch
        if (splitted.length === 1) return false;
        // is not last match?
        if (!splitted.pop()) return false;
        return true;
    }
}
exports.AutoResponderEntryDirectoryPattern = AutoResponderEntryDirectoryPattern;
