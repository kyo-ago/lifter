import { CreateRewriteRuleModifierEntityJSON, RewriteRuleEntityJSON, } from "@lifter/lifter-common";
import { OutgoingHttpHeaders } from "http";
import { ClientRequestEntity } from "../client-request/client-request-entity";
import { LocalFileResponseEntity } from "../local-file-response/local-file-response-entity";
import { RewriteRuleFactory, stringToRewriteRuleActionType } from "./lifecycle/rewrite-rule-factory";
import { RewriteRuleRepository } from "./lifecycle/rewrite-rule-repository";
import { RewriteRuleIdentity } from "./rewrite-rule-identity";

export interface getRewriteRules {
    add: (rules: RewriteRuleEntityJSON[]) => Promise<void>;
    addModifier: (id: number, text: string, param: CreateRewriteRuleModifierEntityJSON) => Promise<void>;
    fetchAll: () => Promise<RewriteRuleEntityJSON[]>;
}

export class RewriteRuleService {
    constructor(
        private rewriteRuleFactory: RewriteRuleFactory,
        private rewriteRuleRepository: RewriteRuleRepository,
    ) {}

    getRewriteRules(): getRewriteRules {
        return {
            add: (rules: RewriteRuleEntityJSON[]): Promise<void> => {
                return this.overwriteAll(rules);
            },
            addModifier: (id: number, text: string, param: CreateRewriteRuleModifierEntityJSON): Promise<void> => {
                return this.addModifier(id, text, param);
            },
            fetchAll: (): Promise<RewriteRuleEntityJSON[]> => {
                return this.fetchAll();
            },
        };
    }

    async getHeader(
        localFileResponseEntity: LocalFileResponseEntity,
        clientRequestEntity: ClientRequestEntity,
    ): Promise<OutgoingHttpHeaders> {
        let rewriteRuleEntities = await this.rewriteRuleRepository.resolveAll();
        return rewriteRuleEntities.reduce((base, rewriteRuleEntity) => {
            return rewriteRuleEntity.applyHeader(clientRequestEntity, base);
        }, localFileResponseEntity.getHeader());
    }

    private async addModifier(id: number, text: string, param: CreateRewriteRuleModifierEntityJSON) {
        let action = stringToRewriteRuleActionType(text);
        let modifier = this.rewriteRuleFactory.createModifier(action, param);
        let entity = await this.rewriteRuleRepository.resolve(new RewriteRuleIdentity(id));
        entity.addModifier(action, modifier);
    }

    private async overwriteAll(rules: RewriteRuleEntityJSON[]): Promise<void> {
        let entities = rules.map(json => RewriteRuleFactory.fromJSON(json));
        await this.rewriteRuleRepository.overwriteAll(entities);
        return;
    }

    private async fetchAll(): Promise<RewriteRuleEntityJSON[]> {
        let allEntities = await this.rewriteRuleRepository.resolveAll();
        return allEntities.map(entity => entity.json);
    }
}
