import * as fs from "fs";
import * as Path from "path";
import {ProjectIdentity} from "../../project/project-identity";
import {AutoResponderEntryDirectoryEntity} from "../auto-responder-entry-directory/auto-responder-entry-directory-entity";
import {AutoResponderEntryDirectoryPath} from "../auto-responder-entry-directory/value-objects/auto-responder-entry-directory-path";
import {AutoResponderEntryDirectoryPattern} from "../auto-responder-entry-directory/value-objects/auto-responder-entry-directory-pattern";
import {
    AbstractAutoResponderEntryEntity, AutoResponderEntryEntityJSON,
    AutoResponderEntryType
} from "../auto-responder-entry-entity";
import {AutoResponderEntryFileEntity} from "../auto-responder-entry-file/auto-responder-entry-file-entity";
import {AutoResponderEntryFilePath} from "../auto-responder-entry-file/value-objects/auto-responder-entry-file-path";
import {AutoResponderEntryFilePattern} from "../auto-responder-entry-file/value-objects/auto-responder-entry-file-pattern";
import {AutoResponderEntryGlobEntity} from "../auto-responder-entry-glob/auto-responder-entry-glob-entity";
import {AutoResponderEntryAnyPath} from "../auto-responder-entry-glob/value-objects/auto-responder-entry-any-path";
import {AutoResponderEntryGlobPattern} from "../auto-responder-entry-glob/value-objects/auto-responder-entry-glob-pattern";
import {AutoResponderEntryIdentity} from "../auto-responder-entry-identity";

export class AutoResponderEntryFactory {
    private identity = 0;
    constructor(private projectIdentity: ProjectIdentity) {}

    static fromJSON(autoResponderEntryEntityJSON: AutoResponderEntryEntityJSON) {
        if (autoResponderEntryEntityJSON.type === "File") {
            return new AutoResponderEntryFileEntity(
                new AutoResponderEntryIdentity(autoResponderEntryEntityJSON.id),
                "File",
                new AutoResponderEntryFilePattern(autoResponderEntryEntityJSON.pattern),
                new AutoResponderEntryFilePath(autoResponderEntryEntityJSON.path),
                this.projectIdentity,
            );
        } else if (autoResponderEntryEntityJSON.type === "Directory") {
            return new AutoResponderEntryDirectoryEntity(
                new AutoResponderEntryIdentity(autoResponderEntryEntityJSON.id),
                "Directory",
                AutoResponderEntryDirectoryPattern.createSafeValue(autoResponderEntryEntityJSON.pattern),
                new AutoResponderEntryDirectoryPath(autoResponderEntryEntityJSON.path),
                this.projectIdentity,
            );
        } else if (autoResponderEntryEntityJSON.type === "Glob") {
            return new AutoResponderEntryGlobEntity(
                new AutoResponderEntryIdentity(autoResponderEntryEntityJSON.id),
                "Glob",
                new AutoResponderEntryGlobPattern(autoResponderEntryEntityJSON.pattern),
                new AutoResponderEntryAnyPath(autoResponderEntryEntityJSON.path),
                this.projectIdentity,
            );
        } else {
            throw new Error(`Invalid type, type = "${type}"`);
        }
    }

    create(type: AutoResponderEntryType, pattern: string, path: string): AbstractAutoResponderEntryEntity {
        if (type === "File") {
            return new AutoResponderEntryFileEntity(
                new AutoResponderEntryIdentity(this.identity++),
                "File",
                new AutoResponderEntryFilePattern(pattern),
                new AutoResponderEntryFilePath(path),
                this.projectIdentity,
            );
        } else if (type === "Directory") {
            return new AutoResponderEntryDirectoryEntity(
                new AutoResponderEntryIdentity(this.identity++),
                "Directory",
                AutoResponderEntryDirectoryPattern.createSafeValue(pattern),
                new AutoResponderEntryDirectoryPath(path),
                this.projectIdentity,
            );
        } else if (type === "Glob") {
            return new AutoResponderEntryGlobEntity(
                new AutoResponderEntryIdentity(this.identity++),
                "Glob",
                new AutoResponderEntryGlobPattern(pattern),
                new AutoResponderEntryAnyPath(path),
                this.projectIdentity,
            );
        } else {
            throw new Error(`Invalid type, type = "${type}"`);
        }
    }

    createFromFile(file: File): Promise<AbstractAutoResponderEntryEntity> {
        return this.createFrom(file.name, (<any>file).path);
    }

    createFromPath(path: string): Promise<AbstractAutoResponderEntryEntity> {
        return this.createFrom(Path.basename(path), path);
    }

    private createFrom(pattern: string, path: string): Promise<AbstractAutoResponderEntryEntity> {
        return new Promise((resolve, reject) => {
            fs.stat(path, (err, stat) => {
                if (err) {
                    return reject(err);
                }
                let autoResponderEntry = this.create(
                    stat.isFile() ? "File" : "Directory",
                    pattern,
                    path
                );
                resolve(autoResponderEntry);
            });
        });
    }
}