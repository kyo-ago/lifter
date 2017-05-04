import {ProjectIdentity} from "./project-identity";
import {ProjectEntity} from "./project-entity";

export class ProjectFactory {
    private static identity = 0;

    static create(): ProjectEntity {
        return new ProjectEntity(
            new ProjectIdentity(this.identity++),
        );
    }
}
