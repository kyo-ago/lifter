import {ProjectFactory} from "../../../src/contexts/proxy/project/lifecycle/project-factory";
import {LifecycleContextService} from "../../../src/windows/main/application/lifecycle-context/lifecycle-context-service";

export function getLifecycleContextService() {
    let projectFactory = new ProjectFactory();
    let projectEntity = projectFactory.create();
    return new LifecycleContextService(projectEntity.id);
}
