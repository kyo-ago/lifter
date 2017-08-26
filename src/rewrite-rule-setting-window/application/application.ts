import {remote} from "electron";
import {None, Option, Some} from "monapt";
import {ShareRewriteRuleIdentity} from "../../share/domain/share-rewrite-rule/share-rewrite-rule-identity";
import {RewriteRuleEntity} from "../domain/rewrite-rule/rewrite-rule-entity";
import {ipcRendererHandler} from "../libs/ipc-renderer-handler";
import {LifecycleContextService} from "./lifecycle-context/lifecycle-context-service";

const windowManager = remote.require('@kyo-ago/electron-window-manager');

export class Application {
    public isContentRendering = false;

    constructor(private lifecycleContextService: LifecycleContextService) {
    }

    saveRewriteRule(url: string, action: string, header: string, value: string): RewriteRuleEntity {
        let rewriteRuleEntity = this.lifecycleContextService.rewriteRuleFactory.create(url, action, header, value);
        this.lifecycleContextService.rewriteRuleRepository.store(rewriteRuleEntity);
        return rewriteRuleEntity;
    }

    deleteRewriteRule(id: ShareRewriteRuleIdentity): RewriteRuleEntity[] {
        this.lifecycleContextService.rewriteRuleRepository.deleteByIdentity(id);
        let rewriteRuleEntities = this.lifecycleContextService.rewriteRuleRepository.resolveAll();
        return rewriteRuleEntities;
    }

    selectRewriteRule(id: ShareRewriteRuleIdentity): Option<RewriteRuleEntity> {
        this.clearSelectedRule();

        let rewriteRule = this.lifecycleContextService.rewriteRuleRepository.resolve(id);
        if (!rewriteRule) return None;
        rewriteRule.select();
        return new Some(this.lifecycleContextService.rewriteRuleRepository.store(rewriteRule));
    }

    cancelRewriteRule(): void {
        this.clearSelectedRule();
    }

    cancelAllRewriteRule(): void {
        window.close();
    }

    saveAllRewriteRule(): void {
        let allRewriteRules = this.lifecycleContextService.rewriteRuleRepository.resolveAll().map((entity) => entity.json);
        windowManager.bridge.emit('overwriteRewriteRules', allRewriteRules);
        window.close();
    }

    private clearSelectedRule () {
        let rewriteRule = this.lifecycleContextService.rewriteRuleRepository.resolveSelectedRewriteRule();
        if (!rewriteRule) return;
        rewriteRule.deselect();
        this.lifecycleContextService.rewriteRuleRepository.store(rewriteRule);
    }
}
