import {ShareRewriteRuleIdentity} from "../../share/domain/share-rewrite-rule/share-rewrite-rule-identity";
import {RewriteRuleRepository} from "../domain/rewrite-rule/rewrite-rule-repository";
import {RewriteRuleFactory} from "../domain/rewrite-rule/rewrite-rule-factory";

export class Application {
    private rewriteRuleRepository: RewriteRuleRepository;

    constructor() {
        this.rewriteRuleRepository = new RewriteRuleRepository();
    }

    saveRewriteRule(action: string, header: string, value: string) {
        return new Promise((resolve, reject) => {
            let rewriteRuleEntity = RewriteRuleFactory.create(action, header, value);
            this.rewriteRuleRepository.store(rewriteRuleEntity);
            resolve(rewriteRuleEntity);
        });
    }

    deleteRewriteRule(id: ShareRewriteRuleIdentity) {
        return new Promise((resolve, reject) => {
            this.rewriteRuleRepository.deleteByIdentity(id);
            let rewriteRuleEntities = this.rewriteRuleRepository.resolveAll();
            resolve(rewriteRuleEntities);
        });
    }

    selectRewriteRule(id: ShareRewriteRuleIdentity) {
        return new Promise((resolve, reject) => {
            let rewriteRule = this.rewriteRuleRepository.resolve(id);
            rewriteRule.select();
            this.rewriteRuleRepository.store(rewriteRule);
            resolve();
        });
    }

    cancelRewriteRule() {
        return new Promise((resolve, reject) => {
            let rewriteRule = this.rewriteRuleRepository.resolveSelectedRewriteRule();
            rewriteRule.deselect();
            this.rewriteRuleRepository.store(rewriteRule);
            resolve();
        });
    }
}
