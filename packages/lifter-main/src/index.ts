import * as App from "./application/application";
import { LifecycleContextService } from "./application/lifecycle-context-service";
import { ServiceContext } from "./application/service-context";
import { ProjectFactory } from "./domains/proxy/project/lifecycle/project-factory";
import { HTTP_SSL_CA_DIR_NAME } from "./settings";

export type Application = App.Application;

export function createApplication(projectBaseDir: string, userDataPath: string): App.Application {
    let httpSslCaDirPath = `${userDataPath}/${HTTP_SSL_CA_DIR_NAME}`;
    let projectEntity = new ProjectFactory().create(projectBaseDir);
    let lifecycleContextService = new LifecycleContextService(projectEntity);
    let serviceContext = new ServiceContext(httpSslCaDirPath, projectEntity, lifecycleContextService);
    return new App.Application(
        lifecycleContextService,
        serviceContext
    );
}
