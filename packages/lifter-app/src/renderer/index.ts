import Vue from 'vue';
import Element from 'element-ui';
import Index from './ui/index.vue';
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/ja';

Vue.use(Element, { locale });

function requireAll(r: any) {
    r.keys().forEach(r);
}

requireAll(require.context("./", true, /\.css$/));
require("./index.css");

new Vue({
    components: { Index },
    template: '<Index />'
}).$mount('#app');
