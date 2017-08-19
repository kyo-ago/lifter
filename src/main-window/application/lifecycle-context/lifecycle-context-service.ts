import {AutoResponderEntryFactory} from "../../domain/auto-responder-entry/lifecycle/auto-responder-entry-factory";
import {AutoResponderEntryRepository} from "../../domain/auto-responder-entry/lifecycle/auto-responder-entry-repositoty";
import {ClientRequestFactory} from "../../domain/client-request/lifecycle/client-request-factory";
import {ClientRequestRepository} from "../../domain/client-request/lifecycle/client-request-repository";
import {LocalFileResponderFactory} from "../../domain/local-file-responder/lifecycle/local-file-responder-factory";
import {ProjectIdentity} from "../../domain/project/project-identity";
import {ProxySettingFactory} from "../../domain/proxy-setting/lifecycle/proxy-setting-factory";
import {ProxySettingRepository} from "../../domain/proxy-setting/lifecycle/proxy-setting-repository";
import {ProxySettingDeviceFactory} from "../../domain/proxy-setting/proxy-setting-device/lifecycle/proxy-setting-device-factory";
import {ProxySettingDeviceRepository} from "../../domain/proxy-setting/proxy-setting-device/lifecycle/proxy-setting-device-repository";
import {RewriteRuleFactory} from "../../domain/rewrite-rule/lifecycle/rewrite-rule-factory";
import {RewriteRuleRepository} from "../../domain/rewrite-rule/lifecycle/rewrite-rule-repository";

export class LifecycleContextService {
    public clientRequestRepository = new ClientRequestRepository();
    public clientRequestFactory = new ClientRequestFactory();
    public rewriteRuleRepository = new RewriteRuleRepository();
    public rewriteRuleFactory = new RewriteRuleFactory();
    public localFileResponderFactory = new LocalFileResponderFactory();
    public proxySettingFactory = new ProxySettingFactory();
    public proxySettingDeviceFactory = new ProxySettingDeviceFactory();

    public autoResponderEntryRepository: AutoResponderEntryRepository;
    public autoResponderEntryFactory: AutoResponderEntryFactory;
    public proxySettingRepository: ProxySettingRepository;
    public proxySettingDeviceRepository: ProxySettingDeviceRepository;

    constructor(projectIdentity: ProjectIdentity) {
        this.proxySettingDeviceRepository = new ProxySettingDeviceRepository(
            this.proxySettingDeviceFactory,
        );
        this.proxySettingRepository = new ProxySettingRepository(
            this.proxySettingFactory,
            this.proxySettingDeviceRepository,
        );

        this.autoResponderEntryRepository = new AutoResponderEntryRepository(
            this.localFileResponderFactory,
        );

        this.autoResponderEntryFactory = new AutoResponderEntryFactory(
            projectIdentity,
        );
    }

    load() {
        return this.proxySettingRepository.loadEntities();
    }
}
