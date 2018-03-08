import {
    AutoResponderEntityJSON,
    CertificateStatus,
    ipc,
    ProxyBypassDomainEntityJSON,
    ProxyCommandGrantStatus,
    ProxySettingStatus,
    RewriteRuleEntityJSON,
} from "@lifter/lifter-common";
import { UserSettingStorage } from "../../domains/libs/user-setting-storage";
import { AutoResponderService } from "../../domains/proxy/auto-responder/auto-responder-service";
import { RewriteRuleFactory } from "../../domains/proxy/rewrite-rule/lifecycle/rewrite-rule-factory";
import { RewriteRuleRepository } from "../../domains/proxy/rewrite-rule/lifecycle/rewrite-rule-repository";
import { CertificateService } from "../../domains/settings/certificate/certificate-service";
import { NetworksetupProxyService } from "../../domains/settings/networksetup-proxy-service/networksetup-proxy-service";
import { ProxyBypassDomainFactory } from "../../domains/settings/proxy-bypass-domain/lifecycle/proxy-bypass-domain-factory";
import { ProxyBypassDomainService } from "../../domains/settings/proxy-bypass-domain/proxy-bypass-domain-service";
import { ProxySettingService } from "../../domains/settings/proxy-setting/proxy-setting-service";

export class UIEventService {
    constructor(
        private autoResponderService: AutoResponderService,
        private certificateService: CertificateService,
        private networksetupProxyService: NetworksetupProxyService,
        private userSettingStorage: UserSettingStorage,
        private proxySettingService: ProxySettingService,
        private proxyBypassDomainService: ProxyBypassDomainService,
        private rewriteRuleRepository: RewriteRuleRepository,
    ) {}

    subscribe() {
        /**
         * AutoResponders
         */
        ipc.subscribe("addAutoResponderEntities", async (_, paths: string[]): Promise<AutoResponderEntityJSON[]> => {
            return this.autoResponderService.store(paths);
        });

        ipc.subscribe("fetchAutoResponderEntities", async (): Promise<AutoResponderEntityJSON[]> => {
            return this.autoResponderService.fetchAllJSONs();
        });

        ipc.subscribe("deleteAutoResponderEntities", async (_, ids: number[]): Promise<void> => {
            return this.autoResponderService.delete(ids);
        });

        /**
         * ProxySettings
         */
        ipc.subscribe("changeCertificateStatus", (): Promise<CertificateStatus> => {
            return this.certificateService.getNewStatus();
        });

        ipc.subscribe("changeProxyCommandGrantStatus", (): Promise<ProxyCommandGrantStatus> => {
            return this.networksetupProxyService.toggleGrantProxyCommand();
        });

        ipc.subscribe("changeNoAutoEnableProxySetting", (): Promise<boolean> => {
            return this.userSettingStorage.toggle("noAutoEnableProxy");
        });

        ipc.subscribe("changeNoPacFileProxySetting", (): Promise<boolean> => {
            return this.userSettingStorage.toggle("noPacFileProxy");
        });

        ipc.subscribe("changeProxySettingStatus", (): Promise<ProxySettingStatus> => {
            return this.proxySettingService.getNewStatus();
        });

        /**
         * ProxyBypassDomains
         */
        ipc.subscribe("getProxyBypassDomains", async (): Promise<ProxyBypassDomainEntityJSON[]> => {
            let allEntities = await this.proxyBypassDomainService.resolveAll();
            return allEntities.map(entity => entity.json);
        });

        ipc.subscribe("saveProxyBypassDomains", async (_, domains: ProxyBypassDomainEntityJSON[]): Promise<void> => {
            let entities = domains.map(json => ProxyBypassDomainFactory.fromJSON(json));
            await this.proxyBypassDomainService.overwriteAll(entities);
            return;
        });

        /**
         * RewriteRules
         */
        ipc.subscribe("getRewriteRules", async (): Promise<RewriteRuleEntityJSON[]> => {
            let allEntities = await this.rewriteRuleRepository.resolveAll();
            return allEntities.map(entity => entity.json);
        });

        ipc.subscribe("saveRewriteRules", async (_, rules: RewriteRuleEntityJSON[]): Promise<void> => {
            let entities = rules.map(json => RewriteRuleFactory.fromJSON(json));
            await this.rewriteRuleRepository.overwriteAll(entities);
            return;
        });
    }
}
