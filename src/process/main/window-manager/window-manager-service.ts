import * as windowManager from '@kyo-ago/electron-window-manager';
import {ProxyBypassDomainFactory} from '../../../domains/proxy/proxy-bypass-domain/lifecycle/proxy-bypass-domain-factory';
import {ProxyBypassDomainRepository} from '../../../domains/proxy/proxy-bypass-domain/lifecycle/proxy-bypass-domain-repository';
import {ProxyBypassDomainEntity} from '../../../domains/proxy/proxy-bypass-domain/proxy-bypass-domain-entity';
import {RewriteRuleFactory} from '../../../domains/proxy/rewrite-rule/lifecycle/rewrite-rule-factory';
import {RewriteRuleRepository} from '../../../domains/proxy/rewrite-rule/lifecycle/rewrite-rule-repository';
import {RewriteRuleEntity} from '../../../domains/proxy/rewrite-rule/rewrite-rule-entity';
import {ShareProxyBypassDomainEntityJSON} from '../../../domains/share/share-proxy-bypass-domain/share-proxy-bypass-domain-entity';
import {ShareRewriteRuleEntityJSON} from '../../../domains/share/share-rewrite-rule/share-rewrite-rule-entity';
import {APPLICATION_NAME, WindowManagerInit} from '../../../settings';

export class WindowManagerService {
    constructor(
        private rewriteRuleFactory: RewriteRuleFactory,
        private rewriteRuleRepository: RewriteRuleRepository,
        private proxyBypassDomainFactory: ProxyBypassDomainFactory,
        private proxyBypassDomainRepository: ProxyBypassDomainRepository,
    ) {
    }

    createWindow() {
        if (windowManager.get('mainWindow')) {
            return;
        }
        windowManager.open('mainWindow', APPLICATION_NAME, '/index.html', 'default', {
            file: 'main-window-state.json',
        });
    }

    load() {
        windowManager.init(WindowManagerInit);

        windowManager.bridge.on('overwriteRewriteRules', (allJsons: ShareRewriteRuleEntityJSON[]) => {
            let entities = allJsons.map((json) => this.rewriteRuleFactory.fromJSON(json));
            this.rewriteRuleRepository.overwriteAll(entities);
        });
        windowManager.bridge.on('overwriteProxyBypassDomains', (allJsons: ShareProxyBypassDomainEntityJSON[]) => {
            let entities = allJsons.map((json) => this.proxyBypassDomainFactory.fromJSON(json));
            this.proxyBypassDomainRepository.overwriteAll(entities);
        });
    }

    openProxyBypassDomainSettingWindow() {
        let allEntities = this.proxyBypassDomainRepository
            .resolveAll()
            .map((entity: ProxyBypassDomainEntity) => entity.json)
        ;
        windowManager.sharedData.set('mainProxyBypassDomains', allEntities);
        windowManager.open(
            'proxyBypassDomainSettingWindow',
            'Proxy bypass domain setting',
            '/proxy-bypass-domain-setting-window.html',
            'default',
            {
                file: 'proxy-bypass-domain-setting-window-state.json',
                parent: windowManager.get('mainWindow'),
            }
        );
    }

    openRewriteRuleSettingWindow() {
        let allRewriteRules = this.rewriteRuleRepository
            .resolveAll()
            .map((entity: RewriteRuleEntity) => entity.json)
        ;

        windowManager.sharedData.set('mainRewriteRules', allRewriteRules);
        windowManager.open(
            'rewriteRuleSettingWindow',
            'Rewrite rule setting',
            '/rewrite-rule-setting-window.html',
            'default',
            {
                file: 'rewrite-rule-setting-window-state.json',
                parent: windowManager.get('mainWindow'),
            }
        );
    }
}
