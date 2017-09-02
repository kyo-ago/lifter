import {ProjectIdentity} from "../project-identity";
import {ProjectEntity} from "../project-entity";
import {AutoResponderEntryFactory} from "../../auto-responder-entry/lifecycle/auto-responder-entry-factory";

export class ProjectFactory {
    private identity = 0;

    create(): ProjectEntity {
        return new ProjectEntity(
            new ProjectIdentity(this.identity++),
        );
    }
}
