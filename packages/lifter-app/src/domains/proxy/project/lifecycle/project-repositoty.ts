import * as Datastore from "nedb";
import { AsyncOnNedbRepository } from "../../base/async-on-nedb-repository";
import { ProjectEntity } from "../project-entity";
import { ProjectIdentity } from "../project-identity";
import { ProjectFactory } from "./project-factory";

export class ProjectRepository extends AsyncOnNedbRepository<ProjectIdentity, ProjectEntity> {
    constructor(datastore: Datastore) {
        super(datastore, {
            toEntity: (json: any): ProjectEntity => {
                return ProjectFactory.fromJSON(json);
            },
            toJSON: (entity: ProjectEntity): any => {
                return entity.json;
            }
        });
    }
}
