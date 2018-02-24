import { LifecycleContextService } from "@lifter/lifter-main/build/application/lifecycle-context-service";
import { ProjectFactory } from "@lifter/lifter-main/build/domains/proxy/project/lifecycle/project-factory";
import { REPOSITORY_BASE_DIR_PATH } from "../../../src/settings";

export async function getLifecycleContextService() {
    let projectFactory = new ProjectFactory();
    let projectEntity = projectFactory.create(REPOSITORY_BASE_DIR_PATH);
    let lifecycleContextService = new LifecycleContextService(projectEntity);
    await lifecycleContextService.load();
    return lifecycleContextService;
}
