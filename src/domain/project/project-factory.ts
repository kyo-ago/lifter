import {ProjectIdentity} from "./project-identity";
import {ProjectEntity} from "./project-entity";
import {AutoResponderEntryFactory} from "../auto-responder-entry/auto-responder-entry-factory";

export class ProjectFactory {
    private static identity = 0;

    static create(): ProjectEntity {
        return new ProjectEntity(
            new ProjectIdentity(this.identity++),
        );
    }

    static createAutoResponderEntryFactory() {
        return new AutoResponderEntryFactory(
            new ProjectIdentity(this.identity++),
        );
    }
}
