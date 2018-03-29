import { createLocalVue, mount } from '@vue/test-utils';
import Element from "element-ui";
import VueI18n from "vue-i18n";
import Vuex from "vuex";
import { ApplicationMock } from "../application/application.mock";
import { getLocale, messages } from "../messages";
import { getStore } from "../store";
import App from "./app.vue";

export function createAppMock() {
    const localVue = createLocalVue();

    localVue.use(Vuex);
    localVue.use(VueI18n);

    let i18n = new VueI18n({
        locale: getLocale(navigator),
        messages,
    });

    localVue.use(Element, {
        i18n: i18n.t.bind(i18n),
    });

    let store = getStore(ApplicationMock);

    return mount(App, {
        store,
        i18n,
        localVue
    });
}
