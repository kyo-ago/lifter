import {ProxySettingStatus, CertificateStatus} from "@lifter/lifter-common";
import Vue from 'vue';
import Vuex from 'vuex';
import {ClientRequestEntity} from "@lifter/lifter-main/build/domains/proxy/client-request/client-request-entity";
import {AbstractAutoResponderEntryEntity} from "@lifter/lifter-main/build/domains/proxy/auto-responder-entry/auto-responder-entry-entity";
import {Application} from '../application/application';
import App from './app.vue';

export default function (application: Application) {
    const store = new Vuex.Store({
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
            addClientRequestEntries(state, clientRequestEntity: ClientRequestEntity) {
                state.clientRequestEntries.push(clientRequestEntity);
            },
            addAutoResponderEntries(state, autoResponderEntries: AbstractAutoResponderEntryEntity[]) {
                state.autoResponderEntries = autoResponderEntries.concat(state.autoResponderEntries);
            },
            overwriteAutoResponderEntries(state, autoResponderEntries: AbstractAutoResponderEntryEntity[]) {
                state.autoResponderEntries = autoResponderEntries;
            },
        },
        actions: {
            async changeProxySettingStatus({ commit }) {
                let newState = await application.clickProxySettingStatus();
                commit('changeProxySettingStatus', newState);
                return newState;
            },
            async changeCertificateState({ commit }) {
                let newState = await application.clickCertificateStatus();
                commit('changeCertificateState', newState);
                return newState;
            },
            async addDropFiles({ commit, state }, files: File[]) {
                if (!state.isAutoResponderFileDropPage) {
                    return;
                }
                let autoResponderEntries = await application.addDropFiles(files);
                commit('addAutoResponderEntries', autoResponderEntries);
                commit('selectAutoResponderTab');
            },
            async deleteAutoResponderEntries({ commit }, targetAutoResponderEntries: AbstractAutoResponderEntryEntity[]) {
                console.log(targetAutoResponderEntries);
                await application.deleteAutoResponderEntities(targetAutoResponderEntries);
                let autoResponderEntries = await application.fetchAutoResponderEntities();
                commit('overwriteAutoResponderEntries', autoResponderEntries);
            },
        },
    });

    application.setOnFileDropEvent(window, () => {
        store.commit("setAutoResponderFileDropPage");
    }, () => {
        store.commit("unsetAutoResponderFileDropPage");
    }, (files: File[]) => {
        store.dispatch('addDropFiles', files);
    });

    application.setOnUpdateClientRequestEntityEvent((clientRequestEntity) => {
        store.commit("addClientRequestEntries", clientRequestEntity);
    });

    new Vue({
        store,
        components: { App },
        template: '<App />',
    }).$mount('#app');
}
