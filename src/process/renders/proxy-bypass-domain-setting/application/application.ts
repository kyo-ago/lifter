import {windowManager} from '../../libs/get-window-manager';
import {StateToProps} from "../ui/reducer";
import {LifecycleContextService} from './lifecycle-context/lifecycle-context-service';

export class Application {
    public isContentRendering = false;

    constructor(private lifecycleContextService: LifecycleContextService) {
    }

    JSONToPreloadedState(jsons: any[]): StateToProps {
        return {
            proxyBypassDomains: jsons.map((json) => this.lifecycleContextService.proxyBypassDomainFactory.fromJSON(json)),
        };
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
