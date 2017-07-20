import {OnMemoryRepository} from "typescript-dddbase";
import {ShareRewriteRuleIdentity} from "./share-rewrite-rule-identity";
import {ShareRewriteRuleEntity} from './share-rewrite-rule-entity';

export class ShareRewriteRuleRepository<
    Identity extends ShareRewriteRuleIdentity,
    Entity extends ShareRewriteRuleEntity
    > extends OnMemoryRepository<Identity, Entity> {

    resolveAll(): Entity[] {
        return Object.keys(this.entities)
            .sort((a, b) => Number(b) - Number(a))
            .map((key) => this.entities[key])
        ;
    }
}
