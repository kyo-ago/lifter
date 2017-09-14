import {ProjectEntity} from '../project-entity';
import {ProjectIdentity} from '../project-identity';

export class ProjectFactory {
    private identity = 0;

    create(): ProjectEntity {
        return new ProjectEntity(
            new ProjectIdentity(this.identity++),
        );
    }
}
