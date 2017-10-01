import * as windowManager from '@kyo-ago/electron-window-manager';
import {ProxyBypassDomainFactory} from '../../../domains/proxy/proxy-bypass-domain/lifecycle/proxy-bypass-domain-factory';
import {ProxyBypassDomainRepository} from '../../../domains/proxy/proxy-bypass-domain/lifecycle/proxy-bypass-domain-repository';
import {ProxyBypassDomainEntity} from '../../../domains/proxy/proxy-bypass-domain/proxy-bypass-domain-entity';
import {RewriteRuleFactory} from '../../../domains/proxy/rewrite-rule/lifecycle/rewrite-rule-factory';
import {RewriteRuleRepository} from '../../../domains/proxy/rewrite-rule/lifecycle/rewrite-rule-repository';
import {RewriteRuleEntity} from '../../../domains/proxy/rewrite-rule/rewrite-rule-entity';
import {ProxySettingRepository} from "../../../domains/settings/proxy-setting/lifecycle/proxy-setting-repository";
import {ShareProxyBypassDomainEntityJSON} from '../../../domains/share/share-proxy-bypass-domain/share-proxy-bypass-domain-entity';
import {ShareRewriteRuleEntityJSON} from '../../../domains/share/share-rewrite-rule/share-rewrite-rule-entity';
import {ipc} from "../../../libs/ipc";
import {APPLICATION_NAME, WindowManagerInit} from '../../../settings';
import {CertificateService} from "../certificate/certificate-service";

export class WindowManagerService {
    constructor(
        private certificateService: CertificateService,
        private proxySettingRepository: ProxySettingRepository,
        private rewriteRuleRepository: RewriteRuleRepository,
        private proxyBypassDomainRepository: ProxyBypassDomainRepository,
    ) {
    }

    async createMainWindow() {
        let name = 'mainWindow';
        if (windowManager.get(name)) {
            return;
        }
        let certificateState = await this.certificateService.getCurrentStatus();
        let proxySettingStatus = await this.proxySettingRepository.getProxySetting().getCurrentStatus();
        windowManager.sharedData.set('mainApps', {
            autoResponderEntries: [],
            clientRequestEntries: [],
            certificateState: certificateState,
            proxySettingStatus: proxySettingStatus,
        });
        windowManager.open(name, APPLICATION_NAME, '/index.html', 'default', {
            file: 'main-window-state.json',
        });
        this.registerWindow(name);
    }

    load() {
        windowManager.init(WindowManagerInit);

        windowManager.bridge.on('overwriteRewriteRules', async (allJsons: ShareRewriteRuleEntityJSON[]) => {
            let entities = allJsons.map((json) => RewriteRuleFactory.fromJSON(json));
            await this.rewriteRuleRepository.overwriteAll(entities);
        });
        windowManager.bridge.on('overwriteProxyBypassDomains', async (allJsons: ShareProxyBypassDomainEntityJSON[]) => {
            let entities = allJsons.map((json) => ProxyBypassDomainFactory.fromJSON(json));
            await this.proxyBypassDomainRepository.overwriteAll(entities);
        });
    }

    async openProxyBypassDomainSettingWindow() {
        let allEntities = await this.proxyBypassDomainRepository.resolveAll();
        let allJsons = allEntities.map((entity: ProxyBypassDomainEntity) => entity.json);

        windowManager.sharedData.set('mainProxyBypassDomains', allJsons);
        let name  = 'proxyBypassDomainSettingWindow';
        windowManager.open(
            name,
            'Proxy bypass domain setting',
            '/proxy-bypass-domain-setting-window.html',
            'default',
            {
                file: 'proxy-bypass-domain-setting-window-state.json',
                parent: windowManager.get('mainWindow'),
            }
        );
        this.registerWindow(name);
    }

    async openRewriteRuleSettingWindow() {
        let allEntities = await this.rewriteRuleRepository.resolveAll();
        let allJsons = allEntities.map((entity: RewriteRuleEntity) => entity.json);

        windowManager.sharedData.set('mainRewriteRules', allJsons);
        let name  = 'rewriteRuleSettingWindow';
        windowManager.open(
            name,
            'Rewrite rule setting',
            '/rewrite-rule-setting-window.html',
            'default',
            {
                file: 'rewrite-rule-setting-window-state.json',
                parent: windowManager.get('mainWindow'),
            }
        );
        this.registerWindow(name);
    }

    private registerWindow(name: string) {
        let window = windowManager.get(name);
        ipc.addWindow(window.object);
        window.object.on('closed', () => ipc.removeWindow(window));
    }
}
