import { RewriteRuleEntityJSON } from "@lifter/lifter-common";
import { Application } from "../../application/application";

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
            async delete({ state, dispatch }, targetRewriteRules: RewriteRuleEntityJSON[]): Promise<void> {
                let targetIds = targetRewriteRules.map(rule => rule.id);
                let entries = state.entries.filter(entry => !targetIds.includes(entry.id));
                await application.saveRewriteRules(entries);
                return await dispatch("gets");
            },
        },
    };
}
