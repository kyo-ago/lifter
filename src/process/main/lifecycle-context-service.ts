import * as Datastore from 'nedb';
import {AutoResponderEntryFactory} from '../../domains/proxy/auto-responder-entry/lifecycle/auto-responder-entry-factory';
import {AutoResponderEntryRepository} from '../../domains/proxy/auto-responder-entry/lifecycle/auto-responder-entry-repositoty';
import {ClientRequestFactory} from '../../domains/proxy/client-request/lifecycle/client-request-factory';
import {ClientRequestRepository} from '../../domains/proxy/client-request/lifecycle/client-request-repository';
import {LocalFileResponderFactory} from '../../domains/proxy/local-file-responder/lifecycle/local-file-responder-factory';
import {ProjectEntity} from "../../domains/proxy/project/project-entity";
import {ProxyBypassDomainRepository} from '../../domains/proxy/proxy-bypass-domain/lifecycle/proxy-bypass-domain-repository';
import {RewriteRuleRepository} from '../../domains/proxy/rewrite-rule/lifecycle/rewrite-rule-repository';
import {ProxySettingFactory} from '../../domains/settings/proxy-setting/lifecycle/proxy-setting-factory';
import {ProxySettingRepository} from '../../domains/settings/proxy-setting/lifecycle/proxy-setting-repository';
import {ProxySettingDeviceFactory} from '../../domains/settings/proxy-setting/proxy-setting-device/lifecycle/proxy-setting-device-factory';
import {ProxySettingDeviceRepository} from '../../domains/settings/proxy-setting/proxy-setting-device/lifecycle/proxy-setting-device-repository';

export class LifecycleContextService {
    public clientRequestRepository = new ClientRequestRepository();
    public clientRequestFactory = new ClientRequestFactory();
    public localFileResponderFactory = new LocalFileResponderFactory();
    public proxySettingFactory = new ProxySettingFactory();
    public proxySettingDeviceFactory = new ProxySettingDeviceFactory();

    public autoResponderEntryRepository: AutoResponderEntryRepository;
    public autoResponderEntryFactory: AutoResponderEntryFactory;
    public proxySettingRepository: ProxySettingRepository;
    public proxySettingDeviceRepository: ProxySettingDeviceRepository;
    public proxyBypassDomainRepository: ProxyBypassDomainRepository;
    public rewriteRuleRepository: RewriteRuleRepository;

    constructor(projectEntity: ProjectEntity) {
        this.proxySettingDeviceRepository = new ProxySettingDeviceRepository(
            this.proxySettingDeviceFactory,
        );
        this.proxySettingRepository = new ProxySettingRepository(
            this.proxySettingFactory,
            this.proxySettingDeviceRepository,
        );

        this.autoResponderEntryRepository = new AutoResponderEntryRepository(
            this.createDatastore('AutoResponderEntryRepository', projectEntity),
            this.localFileResponderFactory,
        );
        this.proxyBypassDomainRepository = new ProxyBypassDomainRepository(
            this.createDatastore('proxyBypassDomainRepository', projectEntity),
        );
        this.rewriteRuleRepository = new RewriteRuleRepository(
            this.createDatastore('RewriteRuleRepository', projectEntity),
        );

        this.autoResponderEntryFactory = new AutoResponderEntryFactory(
            projectEntity.getIdentity(),
        );
    }

    load() {
        return Promise.all([
            this.autoResponderEntryRepository.load(),
            this.rewriteRuleRepository.load(),
            this.proxyBypassDomainRepository.load(),
            this.proxySettingRepository.loadEntities(),
        ]);
    }

    private createDatastore(name: string, projectEntity: ProjectEntity) {
        return new Datastore(projectEntity.path.match<Nedb.DataStoreOptions>({
            Some: (path) => ({
                filename: `${path.value}/${name}.nedb`,
            }),
            None: () => ({
                inMemoryOnly: true,
            }),
        }));
    }
}
