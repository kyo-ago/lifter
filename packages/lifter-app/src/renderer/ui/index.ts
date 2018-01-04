import Vue from 'vue';
import App from './app.vue';

export default function () {
    new Vue({
        components: { App },
        template: '<App />'
    }).$mount('#app');
}
