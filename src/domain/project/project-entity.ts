import {BaseEntity} from "../base/base-entity";
import {ProjectIdentity} from "./project-identity";
import {ProjectName} from "./value-objects/project-name";
import {AutoResponderEntryBaseEntity} from "../auto-responder/entry/base/auto-responder-entry-base-entity";

export class ProjectEntity extends BaseEntity<ProjectIdentity> {
    private name: ProjectName;
    private autoResponders: AutoResponderEntryBaseEntity[];

    addResponder() {}
    deleteResponder() {}
}