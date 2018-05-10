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
            noAutoEnableProxySetting: state.noAutoEnableProxySetting,
            noPacFileProxySetting: state.noPacFileProxySetting,
        },
        getters: {
            proxyCommandIsNotGranted: state => {
                return state.proxyCommandGrantStatus === "Off";
            }
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
                let param = await application.changeProxyCommandGrantStatus();
                commit("changeProxyCommandGrantStatus", param);
                return param;
            },
            async changeCertificateStatus({ commit }) {
                let param = await application.changeCertificateStatus();
                commit("changeCertificateStatus", param);
                return param;
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
