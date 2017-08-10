import {ShareRewriteRuleIdentity} from "../../share/domain/share-rewrite-rule/share-rewrite-rule-identity";
import {LifecycleContextService} from "./lifecycle-context/lifecycle-context-service";

export class Application {
    constructor(private lifecycleContextService: LifecycleContextService) {
    }

    saveRewriteRule(action: string, header: string, value: string) {
        return new Promise((resolve, reject) => {
            let rewriteRuleEntity = this.lifecycleContextService.rewriteRuleFactory.create(action, header, value);
            this.lifecycleContextService.rewriteRuleRepository.store(rewriteRuleEntity);
            resolve(rewriteRuleEntity);
        });
    }

    deleteRewriteRule(id: ShareRewriteRuleIdentity) {
        return new Promise((resolve, reject) => {
            this.lifecycleContextService.rewriteRuleRepository.deleteByIdentity(id);
            let rewriteRuleEntities = this.lifecycleContextService.rewriteRuleRepository.resolveAll();
            resolve(rewriteRuleEntities);
        });
    }

    selectRewriteRule(id: ShareRewriteRuleIdentity) {
        return new Promise((resolve, reject) => {
            let rewriteRule = this.lifecycleContextService.rewriteRuleRepository.resolve(id);
            rewriteRule.select();
            this.lifecycleContextService.rewriteRuleRepository.store(rewriteRule);
            resolve();
        });
    }

    cancelRewriteRule() {
        return new Promise((resolve, reject) => {
            let rewriteRule = this.lifecycleContextService.rewriteRuleRepository.resolveSelectedRewriteRule();
            rewriteRule.deselect();
            this.lifecycleContextService.rewriteRuleRepository.store(rewriteRule);
            resolve();
        });
    }
}
