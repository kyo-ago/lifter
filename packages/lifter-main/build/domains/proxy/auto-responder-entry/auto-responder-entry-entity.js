"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mime = require("mime");
const base_entity_1 = require("../../base/base-entity");
class AutoResponderEntryEntity extends base_entity_1.BaseEntity {
    constructor(identity, type, pattern, path, projectIdentity) {
        super(identity);
        this.type = type;
        this.pattern = pattern;
        this.path = path;
        this.projectIdentity = projectIdentity;
    }
    get json() {
        return {
            id: this.id,
            type: this.type,
            pattern: this.pattern.value,
            path: this.path.value,
            projectId: this.projectIdentity.getValue()
        };
    }
    async filePathToLocalFileResponderParam(filePath) {
        let stats;
        try {
            stats = await filePath.getState();
        } catch (e) {
            // missing file
            return null;
        }
        return {
            path: filePath.value,
            type: mime.getType(filePath.value),
            size: stats.size
        };
    }
}
exports.AutoResponderEntryEntity = AutoResponderEntryEntity;
