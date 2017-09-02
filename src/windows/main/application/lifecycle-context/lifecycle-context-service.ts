import {AutoResponderEntryFactory} from '../../../../contexts/proxy/auto-responder-entry/lifecycle/auto-responder-entry-factory';
import {AutoResponderEntryRepository} from '../../../../contexts/proxy/auto-responder-entry/lifecycle/auto-responder-entry-repositoty';
import {ClientRequestFactory} from '../../../../contexts/proxy/client-request/lifecycle/client-request-factory';
import {ClientRequestRepository} from '../../../../contexts/proxy/client-request/lifecycle/client-request-repository';
import {LocalFileResponderFactory} from '../../../../contexts/proxy/local-file-responder/lifecycle/local-file-responder-factory';
import {ProjectIdentity} from '../../../../contexts/proxy/project/project-identity';
import {ProxyBypassDomainFactory} from '../../../../contexts/proxy/proxy-bypass-domain/lifecycle/proxy-bypass-domain-factory';
import {ProxyBypassDomainRepository} from '../../../../contexts/proxy/proxy-bypass-domain/lifecycle/proxy-bypass-domain-repository';
import {RewriteRuleFactory} from '../../../../contexts/proxy/rewrite-rule/lifecycle/rewrite-rule-factory';
import {RewriteRuleRepository} from '../../../../contexts/proxy/rewrite-rule/lifecycle/rewrite-rule-repository';
import {ProxySettingFactory} from '../../../../contexts/settings/proxy-setting/lifecycle/proxy-setting-factory';
import {ProxySettingRepository} from '../../../../contexts/settings/proxy-setting/lifecycle/proxy-setting-repository';
import {ProxySettingDeviceFactory} from '../../../../contexts/settings/proxy-setting/proxy-setting-device/lifecycle/proxy-setting-device-factory';
import {ProxySettingDeviceRepository} from '../../../../contexts/settings/proxy-setting/proxy-setting-device/lifecycle/proxy-setting-device-repository';

export class LifecycleContextService {
    public clientRequestRepository = new ClientRequestRepository();
    public clientRequestFactory = new ClientRequestFactory();
    public rewriteRuleRepository = new RewriteRuleRepository();
    public rewriteRuleFactory = new RewriteRuleFactory();
    public localFileResponderFactory = new LocalFileResponderFactory();
    public proxySettingFactory = new ProxySettingFactory();
    public proxySettingDeviceFactory = new ProxySettingDeviceFactory();
    public proxyBypassDomainFactory = new ProxyBypassDomainFactory();
    public proxyBypassDomainRepository = new ProxyBypassDomainRepository();

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
