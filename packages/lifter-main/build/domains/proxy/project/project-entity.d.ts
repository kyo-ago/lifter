/// <reference types="nedb" />
import { DataStoreOptions } from "nedb";
import { BaseEntity } from "../../base/base-entity";
import { ProjectIdentity } from "./project-identity";
import { ProjectBaseDir } from "./value-objects/project-base-dir";
import { ProjectName } from "./value-objects/project-name";
export declare class ProjectEntity extends BaseEntity<ProjectIdentity> {
    private name;
    baseDir: ProjectBaseDir;
    constructor(projectIdentity: ProjectIdentity, name: ProjectName, baseDir: ProjectBaseDir);
    readonly json: {
        id: any;
        name: string;
        baseDir: string;
    };
    getDataStoreOptions(name: string): DataStoreOptions;
}
