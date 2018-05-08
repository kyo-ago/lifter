import { injectable } from "inversify";
import { ProjectEntity } from "../project-entity";
import { ProjectIdentity } from "../project-identity";
import { ProjectBaseDir } from "../value-objects/project-base-dir";
import { ProjectName } from "../value-objects/project-name";

@injectable()
export class ProjectFactory {
    private identity = 0;

    static fromJSON(json: any): ProjectEntity {
        return new ProjectEntity(
            new ProjectIdentity(json.id),
            new ProjectName(json.name),
            new ProjectBaseDir(json.baseDir),
        );
    }

    create(projectBaseDir: string): ProjectEntity {
        return new ProjectEntity(
            new ProjectIdentity(this.identity++),
            new ProjectName("new project"),
            new ProjectBaseDir(projectBaseDir),
        );
    }
}
