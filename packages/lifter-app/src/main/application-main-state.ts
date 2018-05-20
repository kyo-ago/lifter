import {
    AutoEnableProxyStatus,
    AutoResponderEntityJSON,
    CertificateStatus,
    ClientRequestEntityJSON,
    PacFileProxyStatus,
    ProxyBypassDomainEntityJSON,
    ProxyCommandGrantStatus,
    ProxySettingStatus,
    RewriteRuleEntityJSON,
} from "@lifter/lifter-common";
import { Application } from "@lifter/lifter-main";

export interface ApplicationMainStateJSON {
    autoResponderEntries: AutoResponderEntityJSON[];
    clientRequestEntries: ClientRequestEntityJSON[];
    proxyBypassDomainEntries: ProxyBypassDomainEntityJSON[];
    rewriteRuleEntries: RewriteRuleEntityJSON[];
    certificateState: CertificateStatus;
    certificateCommands: string[];
    proxySettingStatus: ProxySettingStatus;
    proxyCommandGrantStatus: ProxyCommandGrantStatus;
    proxyCommandGrantCommands: string[];
    autoEnableProxySetting: AutoEnableProxyStatus;
    pacFileProxySetting: PacFileProxyStatus;
}

export async function getApplicationMainStateJSON(
    application: Application,
): Promise<ApplicationMainStateJSON> {
    // Promise.all is max 10 arguments (d.ts limit)
    let [
        autoResponderEntries,
        clientRequestEntries,
        proxyBypassDomainEntries,
        rewriteRuleEntries,
        certificateState,
    ] = await Promise.all([
        application.getAutoResponder().fetchAll(),
        application.getClientRequestService().fetchAll(),
        application.getProxyBypassDomains().fetchAll(),
        application.getRewriteRules().fetchAll(),
        application.getCertificateService().fetchCurrentStatus(),
    ]);
    let [
        certificateCommands,
        proxySettingStatus,
        proxyCommandGrantStatus,
        proxyCommandGrantCommands,
        autoEnableProxySetting,
        pacFileProxySetting,
    ] = await Promise.all([
        application.getCertificateService().fetchCurrentCommands(),
        application.getProxySettingService().fetch(),
        application.getProxyCommandGrantService().fetchStatus(),
        application.getProxyCommandGrantService().fetchCommands(),
        application.getUserSetting().getAutoEnableProxy(),
        application.getUserSetting().getPacFileProxy(),
    ]);

    return {
        autoResponderEntries,
        clientRequestEntries,
        proxyBypassDomainEntries,
        rewriteRuleEntries,
        certificateState,
        certificateCommands,
        proxySettingStatus,
        proxyCommandGrantStatus,
        proxyCommandGrantCommands,
        autoEnableProxySetting,
        pacFileProxySetting,
    };
}
