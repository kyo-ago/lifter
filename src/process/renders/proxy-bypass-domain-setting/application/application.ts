import {windowManager} from '../../libs/get-window-manager';
import {LifecycleContextService} from './lifecycle-context/lifecycle-context-service';

export class Application {
    public isContentRendering = false;

    constructor(private lifecycleContextService: LifecycleContextService) {
    }

    updateEntities(formText: string) {
        let entities = formText
            .split(/\s+/)
            .filter((pattern) => pattern)
            .map((pattern) => this.lifecycleContextService.proxyBypassDomainFactory.create(pattern))
        ;
        this.lifecycleContextService.ProxyBypassDomainRepository.overwriteAll(entities);
        return entities;
    }

    cancelAll(): void {
        window.close();
    }

    saveAll(): void {
        let allJsons = this.lifecycleContextService.ProxyBypassDomainRepository.resolveAll().map((entity) => entity.json);
        windowManager.bridge.emit('overwriteProxyBypassDomains', allJsons);
        window.close();
    }
}
