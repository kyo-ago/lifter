"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auto_responder_entry_entity_1 = require("../auto-responder-entry-entity");
class AutoResponderEntryDirectoryEntity extends auto_responder_entry_entity_1.AutoResponderEntryEntity {
    getMatchResponder(clientRequestEntity) {
        if (!this.pattern.isMatchPath(clientRequestEntity)) return null;
        let filePath = this.path.getAutoResponderEntryFilePath(clientRequestEntity);
        return this.filePathToLocalFileResponderParam(filePath);
    }
}
exports.AutoResponderEntryDirectoryEntity = AutoResponderEntryDirectoryEntity;
