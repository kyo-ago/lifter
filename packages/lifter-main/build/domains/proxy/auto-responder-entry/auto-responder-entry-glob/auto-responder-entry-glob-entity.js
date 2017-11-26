"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auto_responder_entry_entity_1 = require("../auto-responder-entry-entity");
class AutoResponderEntryGlobEntity extends auto_responder_entry_entity_1.AutoResponderEntryEntity {
    async getMatchResponder(clientRequestEntity) {
        if (!this.pattern.isMatchPath(clientRequestEntity)) return null;
        let filePath = await this.path.getAutoResponderEntryFilePath(clientRequestEntity);
        return filePath ? this.filePathToLocalFileResponderParam(filePath) : null;
    }
}
exports.AutoResponderEntryGlobEntity = AutoResponderEntryGlobEntity;
