import { RewriteRuleEntityJSON } from "@lifter/lifter-common";
import { Application } from "../../application/application";

interface ModifierAcrion {
    rewriteRuleId: number;
    targets: RewriteRuleEntityJSON[];
}

export function getRewriteRuleModule(application: Application, rewriteRules: RewriteRuleEntityJSON[]) {
    return {
        namespaced: true,
        state: {
            entries: rewriteRules,
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
            async deletes({ commit }, targets: RewriteRuleEntityJSON[]) {
                await application.deleteRewriteRules(targets);
                let rewriteRules = await application.getRewriteRules();
                commit("save", rewriteRules);
            },
            async deleteModifierDeletes({ commit }, {rewriteRuleId, targets}: ModifierAcrion) {
                await application.deleteRewriteRules(targets);
                let rewriteRules = await application.getRewriteRules();
                commit("save", rewriteRules);
            },
        },
    };
}
