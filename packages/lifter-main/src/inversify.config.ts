import { Container } from "inversify";
import "reflect-metadata";
import { NetworksetupProxyFactory } from "./application/settings/networksetup-proxy/lifecycle/networksetup-proxy-factory";
import { NetworksetupProxyService } from "./application/settings/networksetup-proxy/networksetup-proxy-service";
import { ProxyBypassDomainRepository } from "./application/settings/proxy-bypass-domain/lifecycle/proxy-bypass-domain-repository";
import { ProxyBypassDomainService } from "./application/settings/proxy-bypass-domain/proxy-bypass-domain-service";
import { ProxyCommandGrantService } from "./application/settings/proxy-command-grant/proxy-command-grant-service";
import { UserSettingsStorage } from "./application/settings/user-settings/user-settings-storage";
import { AutoResponderRepository } from "./domains/proxy/auto-responder/lifecycle/auto-responder-repositoty";
import { ProjectFactory } from "./domains/proxy/project/lifecycle/project-factory";
import { ProjectEntity } from "./domains/proxy/project/project-entity";
import { RewriteRuleFactory } from "./domains/proxy/rewrite-rule/lifecycle/rewrite-rule-factory";
import { RewriteRuleRepository } from "./domains/proxy/rewrite-rule/lifecycle/rewrite-rule-repository";
import { SslCertificatePath } from "./libs/ssl-certificate-path";

export async function getContainer(projectBaseDir: string, userDataPath: string): Promise<Container> {
    let container = new Container({ defaultScope: "Singleton", autoBindInjectable: true, skipBaseClassChecks: true });
    container.bind(SslCertificatePath).toConstantValue(new SslCertificatePath(userDataPath));
    container.bind(ProjectEntity).toConstantValue(new ProjectFactory().create(projectBaseDir));

    await Promise.all([
        container.get(AutoResponderRepository).load(),
        container.get(RewriteRuleFactory).load(),
        container.get(RewriteRuleRepository).load(),
        container.get(ProxyBypassDomainRepository).load(),
        container.get(UserSettingsStorage).load(),
        container.get(NetworksetupProxyFactory).load(),
    ]);

    await Promise.all([container.get(NetworksetupProxyService).load(), container.get(ProxyCommandGrantService).load()]);
    await container.get(ProxyBypassDomainService).load();

    return container;
}
