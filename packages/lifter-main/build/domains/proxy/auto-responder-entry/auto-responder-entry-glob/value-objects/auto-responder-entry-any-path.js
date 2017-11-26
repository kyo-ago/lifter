"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Path = require("path");
const auto_responder_entry_file_path_1 = require("../../auto-responder-entry-file/value-objects/auto-responder-entry-file-path");
const auto_responder_entry_path_1 = require("../../value-objects/auto-responder-entry-path");
class AutoResponderEntryAnyPath extends auto_responder_entry_path_1.AutoResponderEntryPath {
    async getAutoResponderEntryFilePath(clientRequestEntity) {
        let stat = await this.getState();
        if (stat.isFile()) {
            return new auto_responder_entry_file_path_1.AutoResponderEntryFilePath(this.value);
        }
        if (!stat.isDirectory()) {
            return null;
        }
        let pathname = clientRequestEntity.pathname;
        // /
        if (pathname === "/") {
            return null;
        }
        // /hoge
        if (pathname.match(/^\/[^\/]+$/)) {
            return new auto_responder_entry_file_path_1.AutoResponderEntryFilePath(Path.join(this.value, pathname));
        }
        let splited = pathname.split(`/${Path.basename(this.value)}/`);
        // unmatch
        if (splited.length === 1) return null;
        let lastPath = splited.pop();
        // directory match
        if (!lastPath) return null;
        return new auto_responder_entry_file_path_1.AutoResponderEntryFilePath(Path.join(this.value, lastPath));
    }
}
exports.AutoResponderEntryAnyPath = AutoResponderEntryAnyPath;
