import { LifecycleContextService } from "../../../src/application/lifecycle-context-service";
import { ProjectFactory } from "../../../src/domains/proxy/project/lifecycle/project-factory";

export async function getLifecycleContextService() {
    let projectFactory = new ProjectFactory();
    let projectEntity = projectFactory.create("./testRepositories");
    let lifecycleContextService = new LifecycleContextService(projectEntity);
    await lifecycleContextService.load();
    return lifecycleContextService;
}
