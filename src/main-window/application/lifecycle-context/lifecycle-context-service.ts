import {AutoResponderEntryRepository} from "../../domain/auto-responder-entry/lifecycle/auto-responder-entry-repositoty";
import {ClientRequestRepository} from "../../domain/client-request/lifecycle/client-request-repository";
import {RewriteRuleRepository} from "../../domain/rewrite-rule/lifecycle/rewrite-rule-repository";
import {ProjectIdentity} from "../../domain/project/project-identity";
import {AutoResponderEntryFactory} from "../../domain/auto-responder-entry/lifecycle/auto-responder-entry-factory";
import {ClientRequestFactory} from "../../domain/client-request/lifecycle/client-request-factory";
import {LocalFileResponderFactory} from "../../domain/local-file-responder/lifecycle/local-file-responder-factory";
import {ProxySettingRepository} from "../../domain/proxy-setting/lifecycle/proxy-setting-repository";
import {ProxySettingFactory} from "../../domain/proxy-setting/lifecycle/proxy-setting-factory";

export class LifecycleContextService {
    public clientRequestRepository = new ClientRequestRepository();
    public clientRequestFactory = new ClientRequestFactory();
    public rewriteRuleRepository = new RewriteRuleRepository();
    public localFileResponderFactory = new LocalFileResponderFactory();
    public proxySettingFactory = new ProxySettingFactory();

    public autoResponderEntryRepository: AutoResponderEntryRepository;
    public autoResponderEntryFactory: AutoResponderEntryFactory;
    public proxySettingRepository: ProxySettingRepository;

    constructor(projectIdentity: ProjectIdentity) {
        this.proxySettingRepository = new ProxySettingRepository(
            this.proxySettingFactory,
        );

        this.autoResponderEntryRepository = new AutoResponderEntryRepository(
            this.localFileResponderFactory,
        );

        this.autoResponderEntryFactory = new AutoResponderEntryFactory(
            projectIdentity,
        );
    }
}
