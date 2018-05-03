import {
    CreateRewriteRuleModifierEntityJSON,
    RewriteRuleActionType,
    RewriteRuleEntityJSON,
    RewriteRuleModifierEntityJSON,
} from "@lifter/lifter-common";
import { Application } from "../../application/application";

interface AddModifierAcrion {
    rewriteRuleId: number;
    target: CreateRewriteRuleModifierEntityJSON;
}

interface DeleteModifierAcrion {
    rewriteRuleId: number;
    targets: RewriteRuleModifierEntityJSON[];
}

export function getRewriteRuleModule(
    application: Application,
    rewriteRules: RewriteRuleEntityJSON[],
) {
    return {
        namespaced: true,
        state: {
            entries: rewriteRules,
        },
        getters: {
            rewriteRule: state => (
                rewriteRuleId: number,
            ): RewriteRuleEntityJSON => {
                return state.entries.find(
                    entity => entity.id === rewriteRuleId,
                );
            },
            modifiers: (_, getters) => (
                rewriteRoleId: number,
                actionType: RewriteRuleActionType,
            ) => {
                return getters.rewriteRule(rewriteRoleId)["modifier"][
                    actionType
                ];
            },
        },
        mutations: {
            save(state, rewriteRules: RewriteRuleEntityJSON[]) {
                state.entries = rewriteRules;
            },
        },
        actions: {
            async gets({ commit }): Promise<RewriteRuleEntityJSON[]> {
                let rewriteRules = await application.getRewriteRules();
                commit("save", rewriteRules);
                return rewriteRules;
            },
            async addRule({ dispatch }, url: string): Promise<void> {
                await application.addRewriteRule(url);
                return await dispatch("gets");
            },
            async deletes({ dispatch }, targets: RewriteRuleEntityJSON[]) {
                await application.deleteRewriteRules(targets);
                return await dispatch("gets");
            },
            async deleteModifierAdd(
                { dispatch },
                { rewriteRuleId, target }: AddModifierAcrion,
            ) {
                await application.addRewriteRuleModifier(
                    "DELETE",
                    rewriteRuleId,
                    target,
                );
                return await dispatch("gets");
            },
            async deleteModifierDeletes(
                { dispatch },
                { rewriteRuleId, targets }: DeleteModifierAcrion,
            ) {
                await application.deleteRewriteRuleModifiers(
                    "DELETE",
                    rewriteRuleId,
                    targets,
                );
                return await dispatch("gets");
            },
            async updateModifierAdd(
                { dispatch },
                { rewriteRuleId, target }: AddModifierAcrion,
            ) {
                await application.addRewriteRuleModifier(
                    "UPDATE",
                    rewriteRuleId,
                    target,
                );
                return await dispatch("gets");
            },
            async updateModifierDeletes(
                { dispatch },
                { rewriteRuleId, targets }: DeleteModifierAcrion,
            ) {
                await application.deleteRewriteRuleModifiers(
                    "UPDATE",
                    rewriteRuleId,
                    targets,
                );
                return await dispatch("gets");
            },
        },
    };
}
