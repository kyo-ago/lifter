import {BaseEntity} from "../base/base-entity";
import {ProjectIdentity} from "./project-identity";
import {ProjectName} from "./value-objects/project-name";
import {ProjectPath} from "./value-objects/project-path";
import {AutoResponderEntryInterface} from "./auto-responder-entry/auto-responder-entry-interface";

export class ProjectEntity extends BaseEntity<ProjectIdentity> {
    private name: ProjectName;
    private path: ProjectPath;
    private autoResponders: AutoResponderEntryInterface[];

    addResponder() {}
    deleteResponder() {}
}