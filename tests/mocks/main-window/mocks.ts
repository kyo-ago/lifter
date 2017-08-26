import {LifecycleContextService} from "../../../src/main-window/application/lifecycle-context/lifecycle-context-service";
import {ProjectFactory} from "../../../src/main-window/domain/project/lifecycle/project-factory";

export function getLifecycleContextService() {
    let projectFactory = new ProjectFactory();
    let projectEntity = projectFactory.create();
    return new LifecycleContextService(projectEntity.id);
}
