import * as App from "./application/application";
import { LifecycleContextService } from "./application/lifecycle-context-service";
import { ServiceContext } from "./application/service-context";
import { SslCertificatePath } from "./domains/libs/ssl-certificate-path";
import { ProjectFactory } from "./domains/proxy/project/lifecycle/project-factory";

export type Application = App.Application;

export function createApplication(projectBaseDir: string, userDataPath: string): App.Application {
    let sslCertificatePath = new SslCertificatePath(userDataPath);
    let projectEntity = new ProjectFactory().create(projectBaseDir);
    let lifecycleContextService = new LifecycleContextService(projectEntity);
    let serviceContext = new ServiceContext(sslCertificatePath, lifecycleContextService);
    return new App.Application(lifecycleContextService, serviceContext);
}
