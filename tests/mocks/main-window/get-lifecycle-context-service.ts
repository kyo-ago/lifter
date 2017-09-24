import {ProjectFactory} from "../../../src/domains/proxy/project/lifecycle/project-factory";
import {LifecycleContextService} from "../../../src/process/renders/main/application/lifecycle-context/lifecycle-context-service";

export function getLifecycleContextService() {
    let projectFactory = new ProjectFactory();
    let projectEntity = projectFactory.create();
    return new LifecycleContextService(projectEntity.id);
}
