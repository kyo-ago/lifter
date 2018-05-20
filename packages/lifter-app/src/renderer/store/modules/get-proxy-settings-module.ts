import { ProxySettingStatus } from "@lifter/lifter-common";
import {
    ChangeCertificateStatusParam,
    ChangeProxyCommandGrantStatusParam,
} from "../../../lib/ipc";
import { ApplicationMainStateJSON } from "../../../main/application-main-state";
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
            autoEnableProxySetting: state.autoEnableProxySetting,
            pacFileProxySetting: state.pacFileProxySetting,
        },
        getters: {
            certificateInstalled: ({ certificateState }) =>
                certificateState === "Installed",
            certificateCommand: ({ certificateCommands }) =>
                certificateCommands.join(" && "),
            proxyCommandIsGranted: ({ proxyCommandGrantStatus }) =>
                proxyCommandGrantStatus === "On",
            proxyCommandIsNotGranted: (_, { proxyCommandIsGranted }) =>
                !proxyCommandIsGranted,
            proxyCommandGrantCommand: ({ proxyCommandGrantCommands }) =>
                proxyCommandGrantCommands.join("\n"),
            autoEnableProxySetting: ({ autoEnableProxySetting }) =>
                autoEnableProxySetting === "On",
            pacFileProxySetting: ({ pacFileProxySetting }) =>
                pacFileProxySetting === "On",
            matchState: (
                { proxySettingStatus },
                { proxyCommandIsGranted },
            ) => (matcher: {
                NotGranted: () => string;
                NoTargetInterfaces: () => string;
                On: () => string;
                Off: () => string;
            }): string => {
                if (!proxyCommandIsGranted) {
                    return matcher.NotGranted();
                }
                if (proxySettingStatus === "NoTargetInterfaces") {
                    return matcher.NoTargetInterfaces();
                }
                if (proxySettingStatus === "On") {
                    return matcher.On();
                }
                if (proxySettingStatus === "Off") {
                    return matcher.Off();
                }
                console.error("Invalid matchState error");
                return "";
            },
        },
        mutations: {
            changeProxySettingStatus(state, newStatus: ProxySettingStatus) {
                state.proxySettingStatus = newStatus;
            },
            changeCertificateStatus(
                state,
                param: ChangeCertificateStatusParam,
            ) {
                state.certificateState = param.status;
                state.certificateCommands = param.command;
            },
            changeProxyCommandGrantStatus(
                state,
                param: ChangeProxyCommandGrantStatusParam,
            ) {
                state.proxyCommandGrantStatus = param.status;
                state.proxyCommandGrantCommands = param.command;
            },
            changeAutoEnableProxySetting(state, newState: boolean) {
                state.autoEnableProxySetting = newState;
            },
            changePacFileProxySetting(state, newState: boolean) {
                state.pacFileProxySetting = newState;
            },
        },
        actions: {
            async changeProxySettingStatus({ commit }) {
                let newStatus = await application.changeProxySettingStatus();
                commit("changeProxySettingStatus", newStatus);
                return newStatus;
            },
            async changeProxyCommandGrantStatus({ commit }) {
                let param = await application.changeProxyCommandGrantStatus();
                commit("changeProxyCommandGrantStatus", param);
                return param;
            },
            async changeCertificateStatus({ commit }) {
                let param = await application.changeCertificateStatus();
                commit("changeCertificateStatus", param);
                return param;
            },
            async changeAutoEnableProxySetting({ commit }) {
                let newState = await application.changeAutoEnableProxySetting();
                commit("changeAutoEnableProxySetting", newState);
                return newState;
            },
            async changePacFileProxySetting({ commit }) {
                let newState = await application.changePacFileProxySetting();
                commit("changePacFileProxySetting", newState);
                return newState;
            },
        },
    };
}
