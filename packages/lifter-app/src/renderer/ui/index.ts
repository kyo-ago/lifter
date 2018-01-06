import {ProxySettingStatus, CertificateStatus} from "@lifter/lifter-common";
import Vue from 'vue';
import Vuex from 'vuex';
import {Application} from '../application/application';
import App from './app.vue';

export default function (application: Application) {
    const store = new Vuex.Store({
        state: {
            selectedTabIndex: 0,
            viewSettingModalPageState: false,
            proxyState: "NoPermission",
            certificateStatus: "missing",
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
            changeProxyState(state, newState: ProxySettingStatus) {
                state.proxyState = newState;
            },
            changeCertificateStatus(state, newState: CertificateStatus) {
                state.certificateStatus = newState;
            },
        },
        actions: {
            async changeProxyState({ commit }) {
                let newState = await application.clickProxySettingStatus();
                commit('changeProxyState', newState);
                return newState;
            },
            async changeCertificateStatus({ commit }) {
                let newState = await application.clickCertificateStatus();
                commit('changeCertificateStatus', newState);
                return newState;
            },
        },
    });

    new Vue({
        store,
        components: { App },
        template: '<App />',
    }).$mount('#app');
}
