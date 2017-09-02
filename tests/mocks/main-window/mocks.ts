import {LifecycleContextService} from "../../../src/windows/main-window/application/lifecycle-context/lifecycle-context-service";
import {ProjectFactory} from "../../../src/contexts/domain/project/lifecycle/project-factory";

export function getLifecycleContextService() {
    let projectFactory = new ProjectFactory();
    let projectEntity = projectFactory.create();
    return new LifecycleContextService(projectEntity.id);
}
