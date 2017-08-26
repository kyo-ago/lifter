import {ResolveAllOnMemoryRepository} from "../../base/lifecycle/resolve-all-on-memory-repository";
import {ShareRewriteRuleEntity} from '../share-rewrite-rule-entity';
import {ShareRewriteRuleIdentity} from "../share-rewrite-rule-identity";

export abstract class ShareRewriteRuleRepository<
    Identity extends ShareRewriteRuleIdentity,
    Entity extends ShareRewriteRuleEntity
> extends ResolveAllOnMemoryRepository<Identity, any> {
}
