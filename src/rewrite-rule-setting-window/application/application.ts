import {None, Option, Some} from "monapt";
import {ShareRewriteRuleIdentity} from "../../share/domain/share-rewrite-rule/share-rewrite-rule-identity";
import {RewriteRuleEntity} from "../domain/rewrite-rule/rewrite-rule-entity";
import {LifecycleContextService} from "./lifecycle-context/lifecycle-context-service";
import {ShareRewriteRuleEntityJSON} from "../../share/domain/share-rewrite-rule/share-rewrite-rule-entity";
import {ipcRendererHandler} from "../libs/ipc-renderer-handler";

export class Application {
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
        let rewriteRule = this.lifecycleContextService.rewriteRuleRepository.resolve(id);
        if (!rewriteRule) return None;
        rewriteRule.select();
        return new Some(this.lifecycleContextService.rewriteRuleRepository.store(rewriteRule));
    }

    cancelRewriteRule(): void {
        let rewriteRule = this.lifecycleContextService.rewriteRuleRepository.resolveSelectedRewriteRule();
        if (!rewriteRule) return;
        rewriteRule.deselect();
        this.lifecycleContextService.rewriteRuleRepository.store(rewriteRule);
    }

    cancelAllRewriteRule(): void {
        window.close();
    }

    saveAllRewriteRule(): void {
        let allRewriteRules = this.lifecycleContextService.rewriteRuleRepository.resolveAll().map((entity) => entity.json);
        ipcRendererHandler.send("overwriteAllRewriteRules", allRewriteRules);
    }
}
