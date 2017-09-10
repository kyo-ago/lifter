import {AutoResponderEntryFactory} from '../../../../../domains/proxy/auto-responder-entry/lifecycle/auto-responder-entry-factory';
import {AutoResponderEntryRepository} from '../../../../../domains/proxy/auto-responder-entry/lifecycle/auto-responder-entry-repositoty';
import {ClientRequestFactory} from '../../../../../domains/proxy/client-request/lifecycle/client-request-factory';
import {ClientRequestRepository} from '../../../../../domains/proxy/client-request/lifecycle/client-request-repository';
import {LocalFileResponderFactory} from '../../../../../domains/proxy/local-file-responder/lifecycle/local-file-responder-factory';
import {ProjectIdentity} from '../../../../../domains/proxy/project/project-identity';
import {ProxyBypassDomainFactory} from '../../../../../domains/proxy/proxy-bypass-domain/lifecycle/proxy-bypass-domain-factory';
import {ProxyBypassDomainRepository} from '../../../../../domains/proxy/proxy-bypass-domain/lifecycle/proxy-bypass-domain-repository';
import {RewriteRuleFactory} from '../../../../../domains/proxy/rewrite-rule/lifecycle/rewrite-rule-factory';
import {RewriteRuleRepository} from '../../../../../domains/proxy/rewrite-rule/lifecycle/rewrite-rule-repository';
import {ProxySettingFactory} from '../../../../../domains/settings/proxy-setting/lifecycle/proxy-setting-factory';
import {ProxySettingRepository} from '../../../../../domains/settings/proxy-setting/lifecycle/proxy-setting-repository';
import {ProxySettingDeviceFactory} from '../../../../../domains/settings/proxy-setting/proxy-setting-device/lifecycle/proxy-setting-device-factory';
import {ProxySettingDeviceRepository} from '../../../../../domains/settings/proxy-setting/proxy-setting-device/lifecycle/proxy-setting-device-repository';

export class LifecycleContextService {
    public clientRequestRepository = new ClientRequestRepository();
    public clientRequestFactory = new ClientRequestFactory();
    public rewriteRuleRepository = new RewriteRuleRepository();
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
}
