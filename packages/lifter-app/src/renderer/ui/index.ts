import {ProxySettingStatus} from "@lifter/lifter-common";
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
        },
        actions: {
            async changeProxyState(context) {
                let newState = await application.clickProxySettingStatus();
                context.commit('changeProxyState', newState);
            },
        },
    });

    new Vue({
        store,
        components: { App },
        template: '<App />',
    }).$mount('#app');
}
