import { Container } from "inversify";
import "reflect-metadata";
import { AutoResponderRepository } from "./domains/proxy/auto-responder/lifecycle/auto-responder-repositoty";
import { ProjectFactory } from "./domains/proxy/project/lifecycle/project-factory";
import { ProjectEntity } from "./domains/proxy/project/project-entity";
import { RewriteRuleFactory } from "./domains/proxy/rewrite-rule/lifecycle/rewrite-rule-factory";
import { RewriteRuleRepository } from "./domains/proxy/rewrite-rule/lifecycle/rewrite-rule-repository";
import { ProxyBypassDomainRepository } from "./domains/settings/proxy-bypass-domain/lifecycle/proxy-bypass-domain-repository";
import { ProxyBypassDomainService } from "./domains/settings/proxy-bypass-domain/proxy-bypass-domain-service";
import { ProxyCommandGrantService } from "./domains/settings/proxy-command-grant/proxy-command-grant-service";
import { UserSettingsStorage } from "./domains/settings/user-settings/user-settings-storage";
import { ProxyCommandPath } from "./libs/proxy-command-path";
import { SslCertificatePath } from "./libs/ssl-certificate-path";
import { UserKeychainsPath } from "./libs/user-keychains-path";

export async function getContainer(
    projectBaseDir: string,
    userDataPath: string,
    userHomePath: string,
): Promise<Container> {
    let container = new Container({
        defaultScope: "Singleton",
        autoBindInjectable: true,
        skipBaseClassChecks: true,
    });
    container
        .bind(SslCertificatePath)
        .toConstantValue(new SslCertificatePath(userDataPath));
    container
        .bind(UserKeychainsPath)
        .toConstantValue(new UserKeychainsPath(userHomePath));
    container
        .bind(ProjectEntity)
        .toConstantValue(new ProjectFactory().create(projectBaseDir));
    container
        .bind(ProxyCommandPath)
        .toConstantValue(await ProxyCommandPath.getPath());

    await Promise.all([
        container.get(AutoResponderRepository).load(),
        container.get(RewriteRuleFactory).load(),
        container.get(RewriteRuleRepository).load(),
        container.get(ProxyBypassDomainRepository).load(),
        container.get(UserSettingsStorage).load(),
    ]);

    await Promise.all([container.get(ProxyCommandGrantService).load()]);
    await container.get(ProxyBypassDomainService).load();

    return container;
}
