import { AutoResponderEntityJSON } from "@lifter/lifter-common";
import * as fs from "fs";
import { injectable } from "inversify";
import * as Path from "path";
import { AsyncNedbIdGenerator } from "../../../base/async-nedb-id-generator";
import { ProjectEntity } from "../../project/project-entity";
import { ProjectIdentity } from "../../project/project-identity";
import { AbstractAutoResponderEntity } from "../auto-responder-entity";
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
        return new AutoResponderGlobEntity(
            new AutoResponderIdentity(autoResponderEntityJSON.id),
            new AutoResponderGlobPattern(autoResponderEntityJSON.pattern),
            new AutoResponderAnyPath(autoResponderEntityJSON.path),
            new ProjectIdentity(autoResponderEntityJSON.projectId),
        );
    }

    create(
        pattern: string,
        path: string,
    ): AbstractAutoResponderEntity {
        return new AutoResponderGlobEntity(
            new AutoResponderIdentity(this.getNextIdNumber()),
            new AutoResponderGlobPattern(pattern),
            new AutoResponderAnyPath(path),
            this.projectEntity.getIdentity(),
        );
    }

    createFromFile(file: File): Promise<AbstractAutoResponderEntity> {
        return this.createFrom(file.name, (<any>file).path);
    }

    createFromPath(path: string): Promise<AbstractAutoResponderEntity> {
        return this.createFrom(Path.basename(path), path);
    }

    private createFrom(
        pattern: string,
        path: string,
    ): Promise<AbstractAutoResponderEntity> {
        return new Promise((resolve, reject) => {
            fs.stat(path, (err) => {
                if (err) {
                    return reject(err);
                }
                let autoResponderEntity = this.create(
                    pattern,
                    path,
                );
                resolve(autoResponderEntity);
            });
        });
    }
}
