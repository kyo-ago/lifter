/// <reference path="../../typings/global.d.ts" />

import { ApplicationMainStateJSON } from "@lifter/lifter-common";
import Element from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

import Vue from "vue";
import Vuex from "vuex";
import VueI18n from 'vue-i18n';

import { Application } from "./application/application";
import { render } from "./components";
import { getLocale, messages } from "./messages";
import { getStore } from "./store";

export interface UIState extends ApplicationMainStateJSON {
    selectedTabIndex: number;
    viewSettingModalPageState: boolean;
    isAutoResponderFileDropPage: boolean;
}

function requireAll(r: any) {
    r.keys().forEach(r);
}

requireAll(require.context("./", true, /\.css$/));
require("./index.css");

Vue.use(Vuex);
Vue.use(VueI18n);

let i18n = new VueI18n({
    locale: getLocale(navigator),
    messages,
});

Vue.use(Element, {
    i18n: i18n.t.bind(i18n),
});

let application = new Application();
let store = getStore(application);

render(store, i18n);
