import {AutoResponderEntryRepository} from '../../domain/auto-responder-entry/auto-responder-entry-repositoty';
import {ClientRequestRepository} from '../../domain/client-request/client-request-repository';
import {RewriteRuleRepository} from '../../domain/rewrite-rule/rewrite-rule-repository';

export class LifecycleContextService {
    public autoResponderEntryRepository = new AutoResponderEntryRepository();
    public clientRequestRepository = new ClientRequestRepository();
    public rewriteRuleRepository = new RewriteRuleRepository();
}
