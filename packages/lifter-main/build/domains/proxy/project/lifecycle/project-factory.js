"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const project_entity_1 = require("../project-entity");
const project_identity_1 = require("../project-identity");
const project_base_dir_1 = require("../value-objects/project-base-dir");
const project_name_1 = require("../value-objects/project-name");
class ProjectFactory {
    constructor() {
        this.identity = 0;
    }
    static fromJSON(json) {
        return new project_entity_1.ProjectEntity(
            new project_identity_1.ProjectIdentity(json.id),
            new project_name_1.ProjectName(json.name),
            new project_base_dir_1.ProjectBaseDir(json.baseDir)
        );
    }
    create(projectBaseDir) {
        return new project_entity_1.ProjectEntity(
            new project_identity_1.ProjectIdentity(this.identity++),
            new project_name_1.ProjectName("new project"),
            new project_base_dir_1.ProjectBaseDir(projectBaseDir)
        );
    }
}
exports.ProjectFactory = ProjectFactory;
