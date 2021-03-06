import Vue, { ComponentOptions } from "vue";
import VueI18n from "vue-i18n";
import { Store } from "vuex";
import App from "./app.vue";

export interface VueComponent extends ComponentOptions<Vue> {
    data?: object | ((this: any) => object);
    computed?: { [key: string]: (this: any, ...args: any[]) => any };
    methods?: { [key: string]: (this: any, ...args: any[]) => any };
    created?(this: any): void;
    beforeDestroy?(this: any): void;
    destroyed?(this: any): void;
    beforeMount?(this: any): void;
    mounted?(this: any): void;
    beforeUpdate?(this: any): void;
    updated?(this: any): void;
    activated?(this: any): void;
    deactivated?(this: any): void;
    errorCaptured?(this: any): boolean | void;
}

export function render(store: Store<any>, i18n: VueI18n) {
    new Vue({
        store,
        i18n,
        components: { App },
        template: "<App />",
    }).$mount("#app");
}
