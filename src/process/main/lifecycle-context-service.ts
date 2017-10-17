import * as Datastore from 'nedb';
import {AutoResponderEntryFactory} from '../../domains/proxy/auto-responder-entry/lifecycle/auto-responder-entry-factory';
import {AutoResponderEntryRepository} from '../../domains/proxy/auto-responder-entry/lifecycle/auto-responder-entry-repositoty';
import {ClientRequestFactory} from '../../domains/proxy/client-request/lifecycle/client-request-factory';
import {ClientRequestRepository} from '../../domains/proxy/client-request/lifecycle/client-request-repository';
import {LocalFileResponderFactory} from '../../domains/proxy/local-file-responder/lifecycle/local-file-responder-factory';
import {ProjectEntity} from "../../domains/proxy/project/project-entity";
import {RewriteRuleRepository} from '../../domains/proxy/rewrite-rule/lifecycle/rewrite-rule-repository';
import {NetworkInterfaceFactory} from '../../domains/settings/network-interface/lifecycle/network-interface-factory';
import {NetworkInterfaceRepository} from '../../domains/settings/network-interface/lifecycle/network-interface-repository';
import {ProxyBypassDomainRepository} from '../../domains/settings/proxy-bypass-domain/lifecycle/proxy-bypass-domain-repository';
import {ProxySettingFactory} from '../../domains/settings/proxy-setting/lifecycle/proxy-setting-factory';
import {ProxySettingRepository} from '../../domains/settings/proxy-setting/lifecycle/proxy-setting-repository';

export class LifecycleContextService {
    public clientRequestRepository = new ClientRequestRepository();
    public clientRequestFactory = new ClientRequestFactory();
    public localFileResponderFactory = new LocalFileResponderFactory();
    public proxySettingFactory = new ProxySettingFactory();
    public networkInterfaceFactory = new NetworkInterfaceFactory();

    public autoResponderEntryRepository: AutoResponderEntryRepository;
    public autoResponderEntryFactory: AutoResponderEntryFactory;
    public proxySettingRepository: ProxySettingRepository;
    public networkInterfaceRepository: NetworkInterfaceRepository;
    public proxyBypassDomainRepository: ProxyBypassDomainRepository;
    public rewriteRuleRepository: RewriteRuleRepository;

    constructor(projectEntity: ProjectEntity) {
        this.networkInterfaceRepository = new NetworkInterfaceRepository(
            this.networkInterfaceFactory,
        );
        this.proxySettingRepository = new ProxySettingRepository(
            this.proxySettingFactory,
            this.networkInterfaceRepository,
        );

        this.autoResponderEntryRepository = new AutoResponderEntryRepository(
            this.createDatastore('autoResponderEntryRepository', projectEntity),
            this.localFileResponderFactory,
        );
        this.proxyBypassDomainRepository = new ProxyBypassDomainRepository(
            this.createDatastore('proxyBypassDomainRepository', projectEntity),
        );
        this.rewriteRuleRepository = new RewriteRuleRepository(
            this.createDatastore('rewriteRuleRepository', projectEntity),
        );

        this.autoResponderEntryFactory = new AutoResponderEntryFactory(
            projectEntity.getIdentity(),
            this.createDatastore('autoResponderEntryFactory', projectEntity),
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
