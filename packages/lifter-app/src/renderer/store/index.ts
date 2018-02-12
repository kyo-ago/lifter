import {
    AutoResponderEntryEntityJSON,
    CertificateStatus,
    ClientRequestEntityJSON,
    ProxyCommandGrantStatus,
    ProxySettingStatus,
} from "@lifter/lifter-common";
import { Store } from "vuex";
import { Application } from "../application/application";
import { UIState } from "../index";

export function getStore(application: Application): Store<UIState> {
    const store = new Store<UIState>({
        state: {
            selectedTabIndex: 0,
            viewSettingModalPageState: false,
            isAutoResponderFileDropPage: false,
            ...application.getCurrentState(),
        },
        mutations: {
            changeSelectedTabIndex(state, index: number) {
                state.selectedTabIndex = index;
            },
            selectAutoResponderTab(state) {
                state.selectedTabIndex = 1;
            },
            showSettingModalPage(state) {
                state.viewSettingModalPageState = true;
            },
            hideSettingModalPage(state) {
                state.viewSettingModalPageState = false;
            },
            setAutoResponderFileDropPage(state) {
                state.isAutoResponderFileDropPage = true;
            },
            unsetAutoResponderFileDropPage(state) {
                state.isAutoResponderFileDropPage = false;
            },
            changeProxySettingStatus(state, newState: ProxySettingStatus) {
                state.proxySettingStatus = newState;
            },
            changeCertificateState(state, newState: CertificateStatus) {
                state.certificateState = newState;
            },
            changeProxyCommandGrantStatus(state, newState: ProxyCommandGrantStatus) {
                state.proxyCommandGrantStatus = newState;
            },
            changeNoAutoEnableProxySetting(state, newState: boolean) {
                state.noAutoEnableProxySetting = newState;
            },
            changeNoPacFileProxySetting(state, newState: boolean) {
                state.noPacFileProxySetting = newState;
            },
            addClientRequestEntries(state, clientRequestEntityJSON: ClientRequestEntityJSON) {
                state.clientRequestEntries.push(clientRequestEntityJSON);
            },
            addAutoResponderEntries(state, autoResponderEntries: AutoResponderEntryEntityJSON[]) {
                state.autoResponderEntries = autoResponderEntries.concat(state.autoResponderEntries);
            },
            overwriteAutoResponderEntries(state, autoResponderEntries: AutoResponderEntryEntityJSON[]) {
                state.autoResponderEntries = autoResponderEntries;
            },
        },
        actions: {
            async changeProxySettingStatus({ commit }) {
                let newState = await application.changeProxySettingStatus();
                commit("changeProxySettingStatus", newState);
                return newState;
            },
            async changeCertificateState({ commit }) {
                let newState = await application.changeCertificateStatus();
                commit("changeCertificateState", newState);
                return newState;
            },
            async changeProxyCommandGrantStatus({ commit }) {
                let newState = await application.changeProxyCommandGrantStatus();
                commit("changeProxyCommandGrantStatus", newState);
                return newState;
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
            async addDropFiles({ commit, state }, files: File[]) {
                if (!state.isAutoResponderFileDropPage) {
                    return;
                }
                let autoResponderEntries = await application.addDropFiles(files);
                commit("addAutoResponderEntries", autoResponderEntries);
                commit("selectAutoResponderTab");
            },
            async deleteAutoResponderEntries(
                { commit },
                targetAutoResponderEntries: AutoResponderEntryEntityJSON[],
            ) {
                await application.deleteAutoResponderEntities(targetAutoResponderEntries);
                let autoResponderEntries = await application.fetchAutoResponderEntities();
                commit("overwriteAutoResponderEntries", autoResponderEntries);
            },
        },
    });

    application.setOnFileDropEvent(
        window,
        () => {
            store.commit("setAutoResponderFileDropPage");
        },
        () => {
            store.commit("unsetAutoResponderFileDropPage");
        },
        (files: File[]) => {
            store.dispatch("addDropFiles", files);
        },
    );

    application.setOnUpdateClientRequestEntityEvent(clientRequestEntity => {
        store.commit("addClientRequestEntries", clientRequestEntity);
    });

    return store;
}
