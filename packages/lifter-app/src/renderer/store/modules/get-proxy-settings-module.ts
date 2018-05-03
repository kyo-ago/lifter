import {
    CertificateStatus,
    ProxyCommandGrantStatus,
    ProxySettingStatus,
} from "@lifter/lifter-common";
import { ApplicationMainStateJSON } from "../../../main/window-manager";
import { Application } from "../../application/application";

export function getProxySettingsModule(
    application: Application,
    state: ApplicationMainStateJSON,
) {
    return {
        namespaced: true,
        state: {
            certificateState: state.certificateState,
            certificateCommands: state.certificateCommands,
            proxySettingStatus: state.proxySettingStatus,
            proxyCommandGrantStatus: state.proxyCommandGrantStatus,
            proxyCommandGrantCommands: state.proxyCommandGrantCommands,
            noAutoEnableProxySetting: state.noAutoEnableProxySetting,
            noPacFileProxySetting: state.noPacFileProxySetting,
        },
        mutations: {
            changeProxySettingStatus(state, newStatus: ProxySettingStatus) {
                state.proxySettingStatus = newStatus;
            },
            changeProxyCommandGrantStatus(
                state,
                newStatus: ProxyCommandGrantStatus,
            ) {
                state.proxyCommandGrantStatus = newStatus;
            },
            changeCertificateStatus(state, newStatus: CertificateStatus) {
                state.certificateState = newStatus;
            },
            changeNoAutoEnableProxySetting(state, newState: boolean) {
                state.noAutoEnableProxySetting = newState;
            },
            changeNoPacFileProxySetting(state, newState: boolean) {
                state.noPacFileProxySetting = newState;
            },
        },
        actions: {
            async changeProxySettingStatus({ commit }) {
                let newStatus = await application.changeProxySettingStatus();
                commit("changeProxySettingStatus", newStatus);
                return newStatus;
            },
            async changeProxyCommandGrantStatus({ commit }) {
                let newStatus = await application.changeProxyCommandGrantStatus();
                commit("changeProxyCommandGrantStatus", newStatus);
                return newStatus;
            },
            async changeCertificateStatus({ commit }) {
                let newStatus = await application.changeCertificateStatus();
                commit("changeCertificateStatus", newStatus);
                return newStatus;
            },
            async changeNoAutoEnableProxySetting({ commit }) {
                let newState = await application.changeNoAutoEnableProxySetting();
                commit("changeNoAutoEnableProxySetting", newState);
                return newState;
            },
            async changeNoPacFileProxySetting({ commit }) {
                let newState = await application.changeNoPacFileProxySetting();
                commit("changeNoPacFileProxySetting", newState);
                return newState;
            },
        },
    };
}
