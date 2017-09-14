import {RewriteRuleFactory} from '../../../../../domains/settings/rewrite-rule/lifecycle/rewrite-rule-factory';
import {RewriteRuleRepository} from '../../../../../domains/settings/rewrite-rule/lifecycle/rewrite-rule-repository';

export class LifecycleContextService {
    public rewriteRuleRepository = new RewriteRuleRepository();
    public rewriteRuleFactory = new RewriteRuleFactory();
}
