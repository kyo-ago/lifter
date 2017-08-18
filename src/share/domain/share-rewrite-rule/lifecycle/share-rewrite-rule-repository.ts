import {OnMemoryRepository} from "typescript-dddbase";
import {ShareRewriteRuleIdentity} from "../share-rewrite-rule-identity";
import {ShareRewriteRuleEntity} from '../share-rewrite-rule-entity';
import {ResolveAllOnMemoryRepository} from "../../base/lifecycle/resolve-all-on-memory-repository";

export abstract class ShareRewriteRuleRepository<
    Identity extends ShareRewriteRuleIdentity,
    Entity extends ShareRewriteRuleEntity
> extends ResolveAllOnMemoryRepository<Identity, Entity> {
}
