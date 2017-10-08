import {ProjectEntity} from '../project-entity';
import {ProjectIdentity} from '../project-identity';
import {ProjectBaseDir} from "../value-objects/project-base-dir";
import {ProjectName} from "../value-objects/project-name";

export class ProjectFactory {
    private identity = 0;

    create(projectBaseDir: string): ProjectEntity {
        return new ProjectEntity(
            new ProjectIdentity(this.identity++),
            new ProjectName('new project'),
            new ProjectBaseDir(projectBaseDir),
        );
    }

    createInMemory(): ProjectEntity {
        return new ProjectEntity(
            new ProjectIdentity(this.identity++),
            new ProjectName('new project'),
        );
    }
}
