import Vue from 'vue';
import Vuex from 'vuex';
import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/ja';
import {Application} from "./application/application";
import render from './ui/index';

Vue.use(Vuex);
Vue.use(Element, { locale });

function requireAll(r: any) {
    r.keys().forEach(r);
}

requireAll(require.context("./", true, /\.css$/));
require("./index.css");
let application = new Application();
application.initialize(window);
render(application);
