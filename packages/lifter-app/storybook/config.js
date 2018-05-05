import { configure } from "@storybook/vue";

import Vue from "vue";
import Vuex from "vuex";
import VueI18n from "vue-i18n";
import Element from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import { getLocale, messages } from "../src/renderer/messages";

global.process = global.process || {
    env: {
        NODE_ENV: "development",
    },
};

Vue.use(Vuex);
Vue.use(VueI18n);
let i18n = new VueI18n({
    locale: getLocale(navigator),
    fallbackLocale: 'en-US',
    messages,
});

Vue.use(Element, {
    i18n: i18n.t.bind(i18n),
});

// automatically import all files ending in *.stories.js
let loadStories = context => {
    context.keys().forEach(filename => context(filename));
};

const stories = require.context("../stories", true, /.stories.js$/);
configure(() => loadStories(stories), module);
