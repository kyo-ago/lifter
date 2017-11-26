"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auto_responder_entry_entity_1 = require("../auto-responder-entry-entity");
class AutoResponderEntryFileEntity extends auto_responder_entry_entity_1.AutoResponderEntryEntity {
    getMatchResponder(clientRequestEntity) {
        if (!this.pattern.isMatchPath(clientRequestEntity)) return null;
        return this.filePathToLocalFileResponderParam(this.path);
    }
}
exports.AutoResponderEntryFileEntity = AutoResponderEntryFileEntity;
