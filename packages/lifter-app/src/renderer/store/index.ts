import { Store } from "vuex";
import { Application } from "../application/application";
import { getAutoResponderModule } from "./modules/get-auto-responder-module";
import { getClientRequestModule } from "./modules/get-client-request-module";
import { getFileDropDialogModule } from "./modules/get-file-drop-dialog-module";
import { getHeaderTabModule } from "./modules/get-header-tab-module";
import { getProxyBypassDomainModule } from "./modules/get-proxy-bypass-domain-module";
import { getProxySettingsModule } from "./modules/get-proxy-settings-module";
import { getRewriteRuleModifiersDialogModule } from "./modules/get-rewrite-rule-modifiers-dialog-module";
import { getRewriteRuleModule } from "./modules/get-rewrite-rule-module";
import { getSettingDialogModule } from "./modules/get-setting-dialog-module";

export function getStore(application: Application): Store<any> {
    let currentState = application.getCurrentState();
    const store = new Store<any>({
        state: {
            contextMenuService: application.contextMenuService,
        },
        actions: {
            async addDropFiles({ commit, state, dispatch }, files: File[]) {
                if (!state.fileDropDialog.isShowing) {
                    return;
                }
                await dispatch("autoResponder/add", files);
                commit("headerTab/changeName", "Auto responder");
            },
        },
        modules: {
            autoResponder: getAutoResponderModule(application, currentState.autoResponderEntries),
            clientRequest: getClientRequestModule(application, currentState.clientRequestEntries),
            fileDropDialog: getFileDropDialogModule(),
            headerTab: getHeaderTabModule(),
            proxyBypassDomain: getProxyBypassDomainModule(application, currentState.proxyBypassDomainEntries),
            proxySettings: getProxySettingsModule(application, currentState),
            rewriteRuleModifiersDialog: getRewriteRuleModifiersDialogModule(),
            rewriteRule: getRewriteRuleModule(application, currentState.rewriteRuleEntries),
            settingDialog: getSettingDialogModule(),
        },
    });

    application.onFileDropEvent(
        window,
        () => {
            store.commit("fileDropDialog/show");
        },
        () => {
            store.commit("fileDropDialog/hide");
        },
        (files: File[]) => {
            store.dispatch("addDropFiles", files);
        },
    );

    application.onAddClientRequestEntity(clientRequest => {
        store.commit("clientRequest/add", clientRequest);
    });

    return store;
}
