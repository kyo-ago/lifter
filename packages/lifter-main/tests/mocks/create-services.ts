import { LifecycleContextService } from "../../src/application/lifecycle-context-service";
import { ProjectFactory } from "../../src/domains/proxy/project/lifecycle/project-factory";

export function createProjectEntity() {
    let projectFactory = new ProjectFactory();
    return projectFactory.create("./testRepositories");
}

export async function createLifecycleContextService() {
    let lifecycleContextService = new LifecycleContextService(createProjectEntity());
    await lifecycleContextService.load();
    return lifecycleContextService;
}
