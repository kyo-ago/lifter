import {RewriteRuleRepository} from "../../../../../domains/settings/rewrite-rule/lifecycle/rewrite-rule-repository";
import {RewriteRuleFactory} from "../../../../../domains/settings/rewrite-rule/lifecycle/rewrite-rule-factory";

export class LifecycleContextService {
    public rewriteRuleRepository = new RewriteRuleRepository();
    public rewriteRuleFactory = new RewriteRuleFactory();
}
