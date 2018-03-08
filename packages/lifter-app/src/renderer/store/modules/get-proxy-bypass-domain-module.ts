import { ProxyBypassDomainEntityJSON } from "@lifter/lifter-common";
import { Application } from "../../application/application";

export function getProxyBypassDomainModule(application: Application, proxyBypassDomains: ProxyBypassDomainEntityJSON[]) {
    return {
        namespaced: true,
        state: {
            entries: proxyBypassDomains,
        },
        mutations: {
            save(state, proxyBypassDomains: ProxyBypassDomainEntityJSON[]) {
                state.entries = proxyBypassDomains;
            },
        },
        actions: {
            async gets({ commit }): Promise<ProxyBypassDomainEntityJSON[]> {
                let proxyBypassDomains = await application.getProxyBypassDomains();
                commit("save", proxyBypassDomains);
                return proxyBypassDomains;
            },
            async save({ dispatch }, targetProxyBypassDomains: ProxyBypassDomainEntityJSON[]): Promise<ProxyBypassDomainEntityJSON[]> {
                await application.saveProxyBypassDomains(targetProxyBypassDomains);
                return await dispatch("gets");
            },
        },
    };
}
