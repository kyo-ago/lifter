import * as assert from "assert";
import "mocha";
import { ApplicationMainStateJSON } from "../../main/window-manager";
import { ApplicationMock } from "../application/application.mock";
import { HeaderTabNameToIndex } from "../store/modules/get-header-tab-module";
import { createAppMock } from "./app.mock";
import DeleteModifiersTable from "./li-dialog/rewrite-rule-modifiers-dialog/delete-modifiers-table.vue";
import TabContents from "./li-header/tab-contents.vue";
import RewriteRule from "./li-main/rewrite-rule.vue";

describe("app.vue", () => {
    it("create", () => {
        let appWrapper = createAppMock();
        assert(appWrapper.find(".el-container").exists());
    });

    it("changeProxySettingStatus", async () => {
        let appWrapper = createAppMock();

        let target = appWrapper.find('[data-test="changeProxySettingStatus"]');

        assert(target.attributes()["data-test-type"] === "info");

        target.trigger("click");

        await new Promise(setTimeout);

        assert(ApplicationMock.changeProxySettingStatus.calledOnce);
        assert(target.attributes()["data-test-type"] === "primary");
    });

    it("addRewriteRuleModifier", async () => {
        let currentState = ApplicationMock.getCurrentState();
        let entity = {
            id: 1,
            url: "http:example.com/*",
            modifier: {
                UPDATE: [],
                DELETE: [],
            },
        };
        ApplicationMock.getCurrentState.callsFake((): ApplicationMainStateJSON => ({
            ...currentState,
            rewriteRuleEntries: [entity],
        }));
        ApplicationMock.getRewriteRules.resolves([entity]);

        let appWrapper = createAppMock();
        appWrapper.find(TabContents).vm["changeTabIndex"](HeaderTabNameToIndex["Rewrite rule"]);
        appWrapper.find(RewriteRule).vm["onClickModifiersButton"](entity.id);
        await appWrapper.vm.$nextTick();
        let deleteModifiersTable = appWrapper.find(DeleteModifiersTable);
        deleteModifiersTable.vm["currentHeader"] = "content-type";
        deleteModifiersTable.vm["addHeader"]();

        assert(ApplicationMock.addRewriteRuleModifier.calledOnce);
        let call = ApplicationMock.addRewriteRuleModifier.lastCall;
        assert(call.args[0] === "DELETE");
        assert(call.args[1] === entity.id);
    });
});
