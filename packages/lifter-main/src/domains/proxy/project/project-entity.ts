import { DataStoreOptions } from "nedb";
import {BaseEntity} from "../../base/base-entity";
import { ProjectIdentity } from "./project-identity";
import { ProjectBaseDir } from "./value-objects/project-base-dir";
import { ProjectName } from "./value-objects/project-name";

export class ProjectEntity extends BaseEntity<ProjectIdentity> {
    constructor(projectIdentity: ProjectIdentity, private name: ProjectName, public baseDir: ProjectBaseDir) {
        super(projectIdentity);
    }

    get json() {
        return {
            id: this.id,
            name: this.name.value,
            baseDir: this.baseDir.value
        };
    }

    getDataStoreOptions(name: string): DataStoreOptions {
        return process.env.NODE_ENV === "test"
            ? {
                  inMemoryOnly: true
              }
            : {
                  filename: `${this.baseDir.value}/${name}.nedb`
              };
    }
}
