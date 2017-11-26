"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Path = require("path");
const auto_responder_entry_file_path_1 = require("../../auto-responder-entry-file/value-objects/auto-responder-entry-file-path");
const auto_responder_entry_path_1 = require("../../value-objects/auto-responder-entry-path");
class AutoResponderEntryDirectoryPath extends auto_responder_entry_path_1.AutoResponderEntryPath {
    getAutoResponderEntryFilePath(clientRequestEntity) {
        let lastPath = clientRequestEntity.pathname.split(`/${Path.basename(this.value)}/`).pop();
        return new auto_responder_entry_file_path_1.AutoResponderEntryFilePath(Path.join(this.value, lastPath));
    }
}
exports.AutoResponderEntryDirectoryPath = AutoResponderEntryDirectoryPath;
