import { ProjectFactory } from "@kyo-ago/lifter-main/src/domains/proxy/project/lifecycle/project-factory";
import { LifecycleContextService } from "@kyo-ago/lifter-main/src/application/lifecycle-context-service";
import { REPOSITORY_BASE_DIR_PATH } from "../../../src/settings";

export async function getLifecycleContextService() {
    let projectFactory = new ProjectFactory();
    let projectEntity = projectFactory.create(REPOSITORY_BASE_DIR_PATH);
    let lifecycleContextService = new LifecycleContextService(projectEntity);
    await lifecycleContextService.load();
    return lifecycleContextService;
}
