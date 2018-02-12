/// <reference path="../../typings/global.d.ts" />

import { ApplicationMainStateJSON } from "@lifter/lifter-common";
import Element from "element-ui";
import locale from "element-ui/lib/locale/lang/ja";
import "element-ui/lib/theme-chalk/index.css";
import Vue from "vue";
import Vuex from "vuex";
import { Application } from "./application/application";
import { render } from "./components";
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
Vue.use(Element, { locale });

let application = new Application();
let store = getStore(application);

render(store);
