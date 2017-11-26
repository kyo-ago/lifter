"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const async_on_nedb_repository_1 = require("../../../base/async-on-nedb-repository");
const project_factory_1 = require("./project-factory");
class ProjectRepository extends async_on_nedb_repository_1.AsyncOnNedbRepository {
    constructor(dataStoreOptions) {
        super(dataStoreOptions, {
            toEntity: json => {
                return project_factory_1.ProjectFactory.fromJSON(json);
            },
            toJSON: entity => {
                return entity.json;
            }
        });
    }
}
exports.ProjectRepository = ProjectRepository;
