import { Application } from "../../src/application/application";
import { LifecycleContextService } from "../../src/application/lifecycle-context-service";
import { ServiceContext } from "../../src/application/service-context";
import { ProjectFactory } from "../../src/domains/proxy/project/lifecycle/project-factory";
import { ProjectEntity } from "../../src/domains/proxy/project/project-entity";

export function createProjectEntity(): ProjectEntity {
    let projectFactory = new ProjectFactory();
    return projectFactory.create("./testRepositories");
}

export async function createLifecycleContextService(): Promise<LifecycleContextService> {
    let lifecycleContextService = new LifecycleContextService(createProjectEntity());
    await lifecycleContextService.load();
    return lifecycleContextService;
}

export class TestApplication extends Application {
    getLifecycleContextService(): LifecycleContextService {
        return this.lifecycleContextService;
    }
    getServiceContext(): ServiceContext {
        return this.serviceContext;
    }
}

export async function createApplication(): Promise<TestApplication> {
    let projectEntity = createProjectEntity();
    let lifecycleContextService = new LifecycleContextService(projectEntity);
    let serviceContext = new ServiceContext(".", lifecycleContextService);
    let application = new TestApplication(lifecycleContextService, serviceContext);
    await application.load();
    return application;
}
