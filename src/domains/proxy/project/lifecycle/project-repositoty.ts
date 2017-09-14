import {OnMemoryRepository} from 'typescript-dddbase';
import {ProjectEntity} from '../project-entity';
import {ProjectIdentity} from '../project-identity';

export class ProjectRepository extends OnMemoryRepository<ProjectIdentity, ProjectEntity> {
}
