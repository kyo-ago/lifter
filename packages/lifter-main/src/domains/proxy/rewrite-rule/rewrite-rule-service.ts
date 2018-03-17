import {
    CreateRewriteRuleModifierEntityJSON,
    RewriteRuleEntityJSON,
    RewriteRuleModifierEntityJSON,
} from "@lifter/lifter-common";
import { OutgoingHttpHeaders } from "http";
import { ClientRequestEntity } from "../client-request/client-request-entity";
import { LocalFileResponseEntity } from "../local-file-response/local-file-response-entity";
import { RewriteRuleFactory, stringToRewriteRuleActionType } from "./lifecycle/rewrite-rule-factory";
import { RewriteRuleRepository } from "./lifecycle/rewrite-rule-repository";
import { RewriteRuleIdentity } from "./rewrite-rule-identity";

export interface getRewriteRules {
    fetchAll: () => Promise<RewriteRuleEntityJSON[]>;
    addRule: (url: string) => Promise<RewriteRuleEntityJSON>;
    changeRule: (rule: RewriteRuleEntityJSON) => Promise<RewriteRuleEntityJSON>;
    deleteRule: (id: number) => Promise<void>;
    addModifier: (action: string, entityId: number, param: CreateRewriteRuleModifierEntityJSON) => Promise<RewriteRuleModifierEntityJSON>;
    deleteModifier: (action: string, entityId: number, modifierId: number) => Promise<void>;
}

export class RewriteRuleService {
    constructor(
        private rewriteRuleFactory: RewriteRuleFactory,
        private rewriteRuleRepository: RewriteRuleRepository,
    ) {}

    getRewriteRules(): getRewriteRules {
        return {
            fetchAll: (): Promise<RewriteRuleEntityJSON[]> => {
                return this.fetchAll();
            },
            addRule: (url: string): Promise<RewriteRuleEntityJSON> => {
                return this.addRule(url);
            },
            changeRule: (rule: RewriteRuleEntityJSON): Promise<RewriteRuleEntityJSON> => {
                return this.changeRule(rule);
            },
            deleteRule: (id: number): Promise<void> => {
                return this.deleteRule(id);
            },
            addModifier: (action: string, entityId: number, param: CreateRewriteRuleModifierEntityJSON): Promise<RewriteRuleModifierEntityJSON> => {
                return this.addModifier(action, entityId, param);
            },
            deleteModifier: (action: string, entityId: number, modifierId: number): Promise<void> => {
                return this.deleteModifier(action, entityId, modifierId);
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

    private async fetchAll(): Promise<RewriteRuleEntityJSON[]> {
        let allEntities = await this.rewriteRuleRepository.resolveAll();
        return allEntities.map(entity => entity.json);
    }

    private async addRule(url: string): Promise<RewriteRuleEntityJSON> {
        let entity = this.rewriteRuleFactory.create(url);
        await this.rewriteRuleRepository.store(entity);
        return entity.json;
    }

    private async changeRule(rule: RewriteRuleEntityJSON): Promise<RewriteRuleEntityJSON> {
        let entity = RewriteRuleFactory.fromJSON(rule);
        await this.rewriteRuleRepository.store(entity);
        return entity.json;
    }

    private async deleteRule(num: number): Promise<void> {
        let id = new RewriteRuleIdentity(num);
        await this.rewriteRuleRepository.deleteByIdentity(id);
        return;
    }

    private async addModifier(actionText: string, entityIdNum: number, param: CreateRewriteRuleModifierEntityJSON): Promise<RewriteRuleModifierEntityJSON> {
        let action = stringToRewriteRuleActionType(actionText);
        let modifier = this.rewriteRuleFactory.createModifier(action, param);
        let entity = await this.rewriteRuleRepository.resolve(new RewriteRuleIdentity(entityIdNum));
        entity.addModifier(action, modifier);
        return modifier.json;
    }

    private async deleteModifier(actionText: string, entityIdNum: number, modifierIdNum: number): Promise<void> {
        let action = stringToRewriteRuleActionType(actionText);
        let entityId = new RewriteRuleIdentity(entityIdNum);
        let ruleEntity = await this.rewriteRuleRepository.resolve(entityId);
        let modifierId = new RewriteRuleIdentity(modifierIdNum);
        ruleEntity.deleteModifier(action, modifierId);
        return;
    }
}
