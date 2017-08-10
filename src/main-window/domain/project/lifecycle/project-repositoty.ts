import {OnMemoryRepository} from "typescript-dddbase";
import {ProjectIdentity} from "../project-identity";
import {ProjectEntity} from "../project-entity";

export class ProjectRepository extends OnMemoryRepository<ProjectIdentity, ProjectEntity> {
}
