import {ProxySettingStatus, CertificateStatus} from "@lifter/lifter-common";
import Vue from 'vue';
import Vuex from 'vuex';
import {ClientRequestEntity} from "@lifter/lifter-main/src/domains/proxy/client-request/client-request-entity";
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
        },
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
