import {ProjectFactory} from "../../../src/domains/proxy/project/lifecycle/project-factory";
import {LifecycleContextService} from "../../../src/process/main/lifecycle-context-service";
import {REPOSITORY_BASE_DIR_PATH} from "../../../src/settings";

export async function getLifecycleContextService() {
    let projectFactory = new ProjectFactory();
    let projectEntity = projectFactory.create(REPOSITORY_BASE_DIR_PATH);
    let lifecycleContextService = new LifecycleContextService(projectEntity);
    await lifecycleContextService.load();
    return lifecycleContextService;
}
