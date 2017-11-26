"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_entity_1 = require("../../base/base-entity");
class ProjectEntity extends base_entity_1.BaseEntity {
    constructor(projectIdentity, name, baseDir) {
        super(projectIdentity);
        this.name = name;
        this.baseDir = baseDir;
    }
    get json() {
        return {
            id: this.id,
            name: this.name.value,
            baseDir: this.baseDir.value
        };
    }
    getDataStoreOptions(name) {
        return process.env.NODE_ENV === "test"
            ? {
                  inMemoryOnly: true
              }
            : {
                  filename: `${this.baseDir.value}/${name}.nedb`
              };
    }
}
exports.ProjectEntity = ProjectEntity;
