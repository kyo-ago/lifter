import { AutoResponderEntityJSON } from "@lifter/lifter-common";
import * as fs from "fs";
import { injectable } from "inversify";
import * as Path from "path";
import { AsyncNedbIdGenerator } from "../../../base/async-nedb-id-generator";
import { ProjectEntity } from "../../project/project-entity";
import { ProjectIdentity } from "../../project/project-identity";
import { AutoResponderEntity } from "../auto-responder-entity";
import { AutoResponderIdentity } from "../auto-responder-identity";
import { AutoResponderAnyPath } from "../value-objects/auto-responder-any-path";
import { AutoResponderPattern } from "../value-objects/auto-responder-pattern";

@injectable()
export class AutoResponderFactory extends AsyncNedbIdGenerator {
    constructor(private projectEntity: ProjectEntity) {
        super(projectEntity.getDataStoreOptions(AutoResponderFactory.name));
    }

    static fromJSON(autoResponderEntityJSON: AutoResponderEntityJSON) {
        return new AutoResponderEntity(
            new AutoResponderIdentity(autoResponderEntityJSON.id),
            new AutoResponderPattern(autoResponderEntityJSON.pattern),
            new AutoResponderAnyPath(autoResponderEntityJSON.path),
            new ProjectIdentity(autoResponderEntityJSON.projectId),
        );
    }

    create(pattern: string, path: string): AutoResponderEntity {
        return new AutoResponderEntity(
            new AutoResponderIdentity(this.getNextIdNumber()),
            new AutoResponderPattern(pattern),
            new AutoResponderAnyPath(path),
            this.projectEntity.getIdentity(),
        );
    }

    createFromFile(file: File): Promise<AutoResponderEntity> {
        return this.createFrom(file.name, (<any>file).path);
    }

    createFromPath(path: string): Promise<AutoResponderEntity> {
        return this.createFrom(Path.basename(path), path);
    }

    private createFrom(
        pattern: string,
        path: string,
    ): Promise<AutoResponderEntity> {
        return new Promise((resolve, reject) => {
            fs.stat(path, err => {
                if (err) {
                    return reject(err);
                }
                let autoResponderEntity = this.create(pattern, path);
                resolve(autoResponderEntity);
            });
        });
    }
}
