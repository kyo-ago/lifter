import { AutoResponderEntityJSON, AutoResponderType } from "@lifter/lifter-common";
import * as fs from "fs";
import { injectable } from "inversify";
import * as Path from "path";
import { AsyncNedbIdGenerator } from "../../../base/async-nedb-id-generator";
import { ProjectEntity } from "../../project/project-entity";
import { ProjectIdentity } from "../../project/project-identity";
import { AutoResponderDirectoryEntity } from "../auto-responder-directory/auto-responder-directory-entity";
import { AutoResponderDirectoryPath } from "../auto-responder-directory/value-objects/auto-responder-directory-path";
import { AutoResponderDirectoryPattern } from "../auto-responder-directory/value-objects/auto-responder-directory-pattern";
import { AbstractAutoResponderEntity } from "../auto-responder-entity";
import { AutoResponderFileEntity } from "../auto-responder-file/auto-responder-file-entity";
import { AutoResponderFilePath } from "../auto-responder-file/value-objects/auto-responder-file-path";
import { AutoResponderFilePattern } from "../auto-responder-file/value-objects/auto-responder-file-pattern";
import { AutoResponderGlobEntity } from "../auto-responder-glob/auto-responder-glob-entity";
import { AutoResponderAnyPath } from "../auto-responder-glob/value-objects/auto-responder-any-path";
import { AutoResponderGlobPattern } from "../auto-responder-glob/value-objects/auto-responder-glob-pattern";
import { AutoResponderIdentity } from "../auto-responder-identity";

@injectable()
export class AutoResponderFactory extends AsyncNedbIdGenerator {
    constructor(private projectEntity: ProjectEntity) {
        super(projectEntity.getDataStoreOptions(AutoResponderFactory.name));
    }

    static fromJSON(autoResponderEntityJSON: AutoResponderEntityJSON) {
        if (autoResponderEntityJSON.type === "File") {
            return new AutoResponderFileEntity(
                new AutoResponderIdentity(autoResponderEntityJSON.id),
                "File",
                new AutoResponderFilePattern(autoResponderEntityJSON.pattern),
                new AutoResponderFilePath(autoResponderEntityJSON.path),
                new ProjectIdentity(autoResponderEntityJSON.projectId),
            );
        } else if (autoResponderEntityJSON.type === "Directory") {
            return new AutoResponderDirectoryEntity(
                new AutoResponderIdentity(autoResponderEntityJSON.id),
                "Directory",
                AutoResponderDirectoryPattern.createSafeValue(autoResponderEntityJSON.pattern),
                new AutoResponderDirectoryPath(autoResponderEntityJSON.path),
                new ProjectIdentity(autoResponderEntityJSON.projectId),
            );
        } else if (autoResponderEntityJSON.type === "Glob") {
            return new AutoResponderGlobEntity(
                new AutoResponderIdentity(autoResponderEntityJSON.id),
                "Glob",
                new AutoResponderGlobPattern(autoResponderEntityJSON.pattern),
                new AutoResponderAnyPath(autoResponderEntityJSON.path),
                new ProjectIdentity(autoResponderEntityJSON.projectId),
            );
        } else {
            throw new Error(`Invalid type, type = "${autoResponderEntityJSON.type}"`);
        }
    }

    create(type: AutoResponderType, pattern: string, path: string): AbstractAutoResponderEntity {
        if (type === "File") {
            return new AutoResponderFileEntity(
                new AutoResponderIdentity(this.getNextIdNumber()),
                "File",
                new AutoResponderFilePattern(pattern),
                new AutoResponderFilePath(path),
                this.projectEntity.getIdentity(),
            );
        } else if (type === "Directory") {
            return new AutoResponderDirectoryEntity(
                new AutoResponderIdentity(this.getNextIdNumber()),
                "Directory",
                AutoResponderDirectoryPattern.createSafeValue(pattern),
                new AutoResponderDirectoryPath(path),
                this.projectEntity.getIdentity(),
            );
        } else if (type === "Glob") {
            return new AutoResponderGlobEntity(
                new AutoResponderIdentity(this.getNextIdNumber()),
                "Glob",
                new AutoResponderGlobPattern(pattern),
                new AutoResponderAnyPath(path),
                this.projectEntity.getIdentity(),
            );
        } else {
            throw new Error(`Invalid type, type = "${type}"`);
        }
    }

    createFromFile(file: File): Promise<AbstractAutoResponderEntity> {
        return this.createFrom(file.name, (<any>file).path);
    }

    createFromPath(path: string): Promise<AbstractAutoResponderEntity> {
        return this.createFrom(Path.basename(path), path);
    }

    private createFrom(pattern: string, path: string): Promise<AbstractAutoResponderEntity> {
        return new Promise((resolve, reject) => {
            fs.stat(path, (err, stat) => {
                if (err) {
                    return reject(err);
                }
                let autoResponderEntity = this.create(stat.isFile() ? "File" : "Directory", pattern, path);
                resolve(autoResponderEntity);
            });
        });
    }
}
