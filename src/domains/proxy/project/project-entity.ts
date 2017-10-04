import {Option} from 'monapt';
import {BaseEntity} from '../../share/base/base-entity';
import {ProjectIdentity} from './project-identity';
import {ProjectBaseDir} from "./value-objects/project-base-dir";
import {ProjectName} from './value-objects/project-name';

export class ProjectEntity extends BaseEntity<ProjectIdentity> {
    public path: Option<ProjectBaseDir>;

    constructor(
        projectIdentity: ProjectIdentity,
        private name: ProjectName,
        path?: ProjectBaseDir,
    ) {
        super(projectIdentity);
        this.path = Option(path);
    }
}
