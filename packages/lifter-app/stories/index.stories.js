import { storiesOf } from "@storybook/vue";
import App from "../src/renderer/components/app";
import LiHeader from "../src/renderer/components/li-header/li-header";
import LiMain from "../src/renderer/components/li-main/li-main";
import LiDialog from "../src/renderer/components/li-dialog/li-dialog";
import { getStore } from "../src/renderer/store";
import { ApplicationMock } from "../src/renderer/application/application.mock";
import { getLocale, messages } from "../src/renderer/messages";
import VueI18n from "vue-i18n";

let i18n = new VueI18n({
    locale: getLocale(navigator),
    messages,
});

storiesOf('App', module)
    .add('app', () => ({
        components: { App },
        template: '<App />',
        store: getStore(ApplicationMock),
        i18n,
    }))
    .add('li-header', () => ({
        components: { LiHeader },
        template: '<li-header />',
        store: getStore(ApplicationMock),
        i18n,
    }))
    .add('li-main', () => ({
        components: { LiMain },
        template: '<li-main />',
        store: getStore(ApplicationMock),
        i18n,
    }))
    .add('li-dialog', () => ({
        components: { LiDialog },
        template: '<li-dialog />',
        store: getStore(ApplicationMock),
        i18n,
    }))
;
