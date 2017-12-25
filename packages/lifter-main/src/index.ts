import { Application } from "./application/application";
import { LifecycleContextService } from "./application/lifecycle-context-service";
import { ProjectFactory } from "./domains/proxy/project/lifecycle/project-factory";
import { HTTP_SSL_CA_DIR_NAME } from "./settings";

export function createApplication(projectBaseDir: string, userDataPath: string): Application {
    let projectEntity = new ProjectFactory().create(projectBaseDir);
    return new Application(
        `${userDataPath}/${HTTP_SSL_CA_DIR_NAME}`,
        projectEntity,
        new LifecycleContextService(projectEntity)
    );
}
