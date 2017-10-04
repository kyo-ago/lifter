import {ProjectFactory} from "../../../src/domains/proxy/project/lifecycle/project-factory";
import {LifecycleContextService} from "../../../src/process/main/lifecycle-context-service";

export async function getLifecycleContextService() {
    let projectFactory = new ProjectFactory();
    let projectEntity = projectFactory.createInMemory();
    let lifecycleContextService = new LifecycleContextService(projectEntity);
    await lifecycleContextService.load();
    return lifecycleContextService;
}
