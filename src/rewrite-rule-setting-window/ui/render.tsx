import {remote} from "electron";
import {None} from "monapt";
import * as React from "react";
import * as ReactDOM from "react-dom";
import {Provider} from "react-redux";
import {ShareRewriteRuleEntityJSON} from "../../share/domain/share-rewrite-rule/share-rewrite-rule-entity";
import {App, Index, RewriteRuleFactoryFromJSON} from "./components/index";
import {configureStore} from "./store";

const windowManager = remote.require('@kyo-ago/electron-window-manager');

export function render(container: Element | null) {
    let allRewriteRules: ShareRewriteRuleEntityJSON[] = windowManager.sharedData.fetch('mainRewriteRules');
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
