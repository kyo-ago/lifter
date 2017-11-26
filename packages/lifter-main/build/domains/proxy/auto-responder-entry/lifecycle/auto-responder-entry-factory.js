"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const Path = require("path");
const async_on_nedb_factory_1 = require("../../../base/async-on-nedb-factory");
const project_identity_1 = require("../../project/project-identity");
const auto_responder_entry_directory_entity_1 = require("../auto-responder-entry-directory/auto-responder-entry-directory-entity");
const auto_responder_entry_directory_path_1 = require("../auto-responder-entry-directory/value-objects/auto-responder-entry-directory-path");
const auto_responder_entry_directory_pattern_1 = require("../auto-responder-entry-directory/value-objects/auto-responder-entry-directory-pattern");
const auto_responder_entry_file_entity_1 = require("../auto-responder-entry-file/auto-responder-entry-file-entity");
const auto_responder_entry_file_path_1 = require("../auto-responder-entry-file/value-objects/auto-responder-entry-file-path");
const auto_responder_entry_file_pattern_1 = require("../auto-responder-entry-file/value-objects/auto-responder-entry-file-pattern");
const auto_responder_entry_glob_entity_1 = require("../auto-responder-entry-glob/auto-responder-entry-glob-entity");
const auto_responder_entry_any_path_1 = require("../auto-responder-entry-glob/value-objects/auto-responder-entry-any-path");
const auto_responder_entry_glob_pattern_1 = require("../auto-responder-entry-glob/value-objects/auto-responder-entry-glob-pattern");
const auto_responder_entry_identity_1 = require("../auto-responder-entry-identity");
class AutoResponderEntryFactory extends async_on_nedb_factory_1.AsyncOnNedbFactory {
    constructor(projectEntity) {
        super(projectEntity.getDataStoreOptions("autoResponderEntryFactory"));
        this.projectEntity = projectEntity;
    }
    static fromJSON(autoResponderEntryEntityJSON) {
        if (autoResponderEntryEntityJSON.type === "File") {
            return new auto_responder_entry_file_entity_1.AutoResponderEntryFileEntity(
                new auto_responder_entry_identity_1.AutoResponderEntryIdentity(autoResponderEntryEntityJSON.id),
                "File",
                new auto_responder_entry_file_pattern_1.AutoResponderEntryFilePattern(
                    autoResponderEntryEntityJSON.pattern
                ),
                new auto_responder_entry_file_path_1.AutoResponderEntryFilePath(autoResponderEntryEntityJSON.path),
                new project_identity_1.ProjectIdentity(autoResponderEntryEntityJSON.projectId)
            );
        } else if (autoResponderEntryEntityJSON.type === "Directory") {
            return new auto_responder_entry_directory_entity_1.AutoResponderEntryDirectoryEntity(
                new auto_responder_entry_identity_1.AutoResponderEntryIdentity(autoResponderEntryEntityJSON.id),
                "Directory",
                auto_responder_entry_directory_pattern_1.AutoResponderEntryDirectoryPattern.createSafeValue(
                    autoResponderEntryEntityJSON.pattern
                ),
                new auto_responder_entry_directory_path_1.AutoResponderEntryDirectoryPath(
                    autoResponderEntryEntityJSON.path
                ),
                new project_identity_1.ProjectIdentity(autoResponderEntryEntityJSON.projectId)
            );
        } else if (autoResponderEntryEntityJSON.type === "Glob") {
            return new auto_responder_entry_glob_entity_1.AutoResponderEntryGlobEntity(
                new auto_responder_entry_identity_1.AutoResponderEntryIdentity(autoResponderEntryEntityJSON.id),
                "Glob",
                new auto_responder_entry_glob_pattern_1.AutoResponderEntryGlobPattern(
                    autoResponderEntryEntityJSON.pattern
                ),
                new auto_responder_entry_any_path_1.AutoResponderEntryAnyPath(autoResponderEntryEntityJSON.path),
                new project_identity_1.ProjectIdentity(autoResponderEntryEntityJSON.projectId)
            );
        } else {
            throw new Error(`Invalid type, type = "${autoResponderEntryEntityJSON.type}"`);
        }
    }
    create(type, pattern, path) {
        if (type === "File") {
            return new auto_responder_entry_file_entity_1.AutoResponderEntryFileEntity(
                new auto_responder_entry_identity_1.AutoResponderEntryIdentity(this.getNextIdNumber()),
                "File",
                new auto_responder_entry_file_pattern_1.AutoResponderEntryFilePattern(pattern),
                new auto_responder_entry_file_path_1.AutoResponderEntryFilePath(path),
                this.projectEntity.getIdentity()
            );
        } else if (type === "Directory") {
            return new auto_responder_entry_directory_entity_1.AutoResponderEntryDirectoryEntity(
                new auto_responder_entry_identity_1.AutoResponderEntryIdentity(this.getNextIdNumber()),
                "Directory",
                auto_responder_entry_directory_pattern_1.AutoResponderEntryDirectoryPattern.createSafeValue(pattern),
                new auto_responder_entry_directory_path_1.AutoResponderEntryDirectoryPath(path),
                this.projectEntity.getIdentity()
            );
        } else if (type === "Glob") {
            return new auto_responder_entry_glob_entity_1.AutoResponderEntryGlobEntity(
                new auto_responder_entry_identity_1.AutoResponderEntryIdentity(this.getNextIdNumber()),
                "Glob",
                new auto_responder_entry_glob_pattern_1.AutoResponderEntryGlobPattern(pattern),
                new auto_responder_entry_any_path_1.AutoResponderEntryAnyPath(path),
                this.projectEntity.getIdentity()
            );
        } else {
            throw new Error(`Invalid type, type = "${type}"`);
        }
    }
    createFromFile(file) {
        return this.createFrom(file.name, file.path);
    }
    createFromPath(path) {
        return this.createFrom(Path.basename(path), path);
    }
    createFrom(pattern, path) {
        return new Promise((resolve, reject) => {
            fs.stat(path, (err, stat) => {
                if (err) {
                    return reject(err);
                }
                let autoResponderEntry = this.create(stat.isFile() ? "File" : "Directory", pattern, path);
                resolve(autoResponderEntry);
            });
        });
    }
}
exports.AutoResponderEntryFactory = AutoResponderEntryFactory;
