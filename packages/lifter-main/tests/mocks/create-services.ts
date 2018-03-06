import { Application } from "../../src/application/application";
import { LifecycleContextService } from "../../src/application/lifecycle-context-service";
import { AutoResponderService } from "../../src/domains/proxy/auto-responder/auto-responder-service";
import { ClientResponder } from "../../src/domains/proxy/client-responder/client-responder";
import { PacFileService } from "../../src/domains/proxy/pac-file/pac-file-service";
import { ProjectFactory } from "../../src/domains/proxy/project/lifecycle/project-factory";
import { ProjectEntity } from "../../src/domains/proxy/project/project-entity";

export function createProjectEntity(): ProjectEntity {
    let projectFactory = new ProjectFactory();
    return projectFactory.create("./testRepositories");
}

export async function createLifecycleContextService(): Promise<LifecycleContextService> {
    let lifecycleContextService = new LifecycleContextService(createProjectEntity());
    await lifecycleContextService.load();
    return lifecycleContextService;
}

export class TestApplication extends Application {
    getClientResponder(): ClientResponder {
        return this.clientResponder;
    }
    getAutoResponderService(): AutoResponderService {
        return this.autoResponderService;
    }
    getPacFileService(): PacFileService {
        return this.pacFileService;
    }
}

export async function createApplication() {
    let projectEntity = createProjectEntity();
    let application = new TestApplication(".", projectEntity, new LifecycleContextService(projectEntity));
    await application.load();
    return application;
}
