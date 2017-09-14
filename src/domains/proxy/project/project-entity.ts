import {Option} from 'monapt';
import {BaseEntity} from '../../share/base/base-entity';
import {ProjectIdentity} from './project-identity';
import {ProjectName} from './value-objects/project-name';
import {ProjectPath} from './value-objects/project-path';

export class ProjectEntity extends BaseEntity<ProjectIdentity> {
    private path: Option<ProjectPath>;

    constructor(
        projectIdentity: ProjectIdentity,
        private name: ProjectName = new ProjectName('new project'),
        path?: ProjectPath,
    ) {
        super(projectIdentity);
        this.path = Option(path);
    }
}