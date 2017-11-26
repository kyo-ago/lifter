/// <reference types="nedb" />
import Datastore = require("nedb");
import { AsyncOnNedbRepository } from "../../../base/async-on-nedb-repository";
import { ProjectEntity } from "../project-entity";
import { ProjectIdentity } from "../project-identity";
export declare class ProjectRepository extends AsyncOnNedbRepository<ProjectIdentity, ProjectEntity> {
    constructor(dataStoreOptions: Datastore.DataStoreOptions);
}
