import { storiesOf } from '@storybook/vue';
// import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import App from '../src/renderer/components/app';
import Divider from '../src/renderer/components/li-header/divider';
import LeftToolbar from '../src/renderer/components/li-header/left-toolbar';
import LiHeader from '../src/renderer/components/li-header/li-header';
import RightToolbar from '../src/renderer/components/li-header/right-toolbar';
import TabContents from '../src/renderer/components/li-header/tab-contents';
import { getStore } from "../src/renderer/store";
import { ApplicationMock } from "../src/renderer/application/application.mock";

storiesOf('App', module).add('app', () => ({
    components: { App },
    template: '<App />',
    methods: { action: linkTo('li-header') },
    store: getStore(ApplicationMock),
}));

storiesOf('li-header', module)
    .add('li-header', () => ({
        components: { LiHeader },
        template: '<li-header />',
        store: getStore(ApplicationMock),
    }))
    .add('left-toolbar', () => ({
        components: { LeftToolbar },
        template: '<left-toolbar />',
        store: getStore(ApplicationMock),
    }))
    .add('right-toolbar', () => ({
        components: { RightToolbar },
        template: '<right-toolbar />',
        store: getStore(ApplicationMock),
    }))
    .add('tab-contents', () => ({
        components: { TabContents },
        template: '<tab-contents />',
        store: getStore(ApplicationMock),
    }))
    .add('divider', () => ({
        components: { Divider },
        template: '<divider />',
        store: getStore(ApplicationMock),
    }))
;
