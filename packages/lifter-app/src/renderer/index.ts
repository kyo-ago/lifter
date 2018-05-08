/// <reference path="../../typings/global.d.ts" />

import Element from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import Vue from "vue";
import VueI18n from "vue-i18n";
import Vuex from "vuex";

import { Application } from "./application/application";
import { render } from "./components";
import { getLocale, messages } from "./messages";
import { getStore } from "./store";

((context: any) => context.keys().forEach(context))(
    require.context("./", true, /\.css$/),
);

Vue.use(Vuex);
Vue.use(VueI18n);

let i18n = new VueI18n({
    locale: getLocale(navigator),
    fallbackLocale: "en-US",
    messages,
});

Vue.use(Element, {
    i18n: i18n.t.bind(i18n),
});

let application = new Application();
application.load();
let store = getStore(application);

render(store, i18n);
