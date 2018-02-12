import * as App from "./application/application";
import { LifecycleContextService } from "./application/lifecycle-context-service";
import { ProjectFactory } from "./domains/proxy/project/lifecycle/project-factory";
import { HTTP_SSL_CA_DIR_NAME } from "./settings";

export type Application = App.Application;

export function createApplication(projectBaseDir: string, userDataPath: string): App.Application {
    let projectEntity = new ProjectFactory().create(projectBaseDir);
    return new App.Application(
        `${userDataPath}/${HTTP_SSL_CA_DIR_NAME}`,
        projectEntity,
        new LifecycleContextService(projectEntity),
    );
}
