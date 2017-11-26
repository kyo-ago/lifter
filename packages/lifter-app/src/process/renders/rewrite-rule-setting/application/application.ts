import { None, Option, Some } from "monapt";
import { RewriteRuleEntity } from "../../../../domains/rewrite-rule/rewrite-rule-entity";
import { RewriteRuleIdentity } from "../../../../domains/rewrite-rule/rewrite-rule-identity";
import { windowManager } from "../../libs/get-window-manager";
import { StateToProps } from "../ui/reducer";
import { LifecycleContextService } from "./lifecycle-context/lifecycle-context-service";

export class Application {
    public isContentRendering = false;

    constructor(private lifecycleContextService: LifecycleContextService) {}

    JSONToPreloadedState(jsons: any[]): StateToProps {
        return {
            rewriteRules: jsons.map(json => this.lifecycleContextService.rewriteRuleFactory.fromJSON(json)),
            currentRewriteRule: None
        };
    }

    saveRewriteRule(url: string, action: string, header: string, value: string): RewriteRuleEntity {
        let rewriteRuleEntity = this.lifecycleContextService.rewriteRuleFactory.create(url, action, header, value);
        this.lifecycleContextService.rewriteRuleRepository.store(rewriteRuleEntity);
        return rewriteRuleEntity;
    }

    deleteRewriteRule(id: RewriteRuleIdentity): RewriteRuleEntity[] {
        this.lifecycleContextService.rewriteRuleRepository.deleteByIdentity(id);
        let rewriteRuleEntities = this.lifecycleContextService.rewriteRuleRepository.resolveAll();
        return rewriteRuleEntities;
    }

    selectRewriteRule(id: RewriteRuleIdentity): Option<RewriteRuleEntity> {
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
        let allRewriteRules = this.lifecycleContextService.rewriteRuleRepository
            .resolveAll()
            .map(entity => entity.json);
        windowManager.bridge.emit("overwriteRewriteRules", allRewriteRules);
        window.close();
    }

    private clearSelectedRule() {
        let rewriteRule = this.lifecycleContextService.rewriteRuleRepository.resolveSelectedRewriteRule();
        if (!rewriteRule) return;
        rewriteRule.deselect();
        this.lifecycleContextService.rewriteRuleRepository.store(rewriteRule);
    }
}
