import {None} from "monapt";
import * as React from "react";
import * as ReactDOM from "react-dom";
import {Provider} from "react-redux";
import {windowManager} from "../../libs/get-window-manager";
import {App, Index, RewriteRuleFactoryFromJSON} from "./components/index";
import {configureStore} from "./store";

export function render(container: Element | null) {
    let allRewriteRules = windowManager.sharedData.fetch('mainRewriteRules');
    windowManager.sharedData.set('mainRewriteRules', []);

    let allRewriteRuleEntities = allRewriteRules.map((json) => RewriteRuleFactoryFromJSON(json));

    const store = configureStore({
        rewriteRules: allRewriteRuleEntities,
        currentRewriteRule: None,
    });

    ReactDOM.render(
        <Provider store={store}>
            <Index />
        </Provider>,
        container,
        () => {
            App.isContentRendering = true;
        },
    );
}
