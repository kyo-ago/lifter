import Datastore = require("nedb");
import { injectable } from "inversify";
import { AsyncOnNedbRepository } from "../../../base/async-on-nedb-repository";
import { ProjectEntity } from "../project-entity";
import { ProjectIdentity } from "../project-identity";
import { ProjectFactory } from "./project-factory";

@injectable()
export class ProjectRepository extends AsyncOnNedbRepository<ProjectIdentity, ProjectEntity> {
    constructor(dataStoreOptions: Datastore.DataStoreOptions) {
        super(dataStoreOptions, {
            toEntity: (json: any): ProjectEntity => {
                return ProjectFactory.fromJSON(json);
            },
            toJSON: (entity: ProjectEntity): any => {
                return entity.json;
            },
        });
    }
}
