import { Application } from "./application/application";
import { LifecycleContextService } from "./application/lifecycle-context-service";
import { ProjectFactory } from "./domains/proxy/project/lifecycle/project-factory";

export function createApplication(projectBaseDir: string) {
    let projectEntity = new ProjectFactory().create(projectBaseDir);
    return new Application(projectEntity, new LifecycleContextService(projectEntity));
}
