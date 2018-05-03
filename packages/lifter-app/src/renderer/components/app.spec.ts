import { Wrapper } from "@vue/test-utils";
import * as assert from "assert";
import "mocha";
import { ApplicationMainStateJSON } from "../../main/window-manager";
import { ApplicationMock } from "../application/application.mock";
import { HeaderTabNameToIndex } from "../store/modules/get-header-tab-module";
import { createAppMock } from "./app.mock";
import DeleteModifiersTable from "./li-dialog/rewrite-rule-modifiers-dialog/delete-modifiers-table.vue";
import UpdateModifiersTable from "./li-dialog/rewrite-rule-modifiers-dialog/update-modifiers-table.vue";
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
        assert(ApplicationMock.changeProxySettingStatus.notCalled);

        target.trigger("click");

        await new Promise(setTimeout);

        assert(ApplicationMock.changeProxySettingStatus.calledOnce);
    });

    context("RewriteRuleModifier", () => {
        let entity = {
            id: 1,
            url: "http:example.com/*",
            modifier: {
                UPDATE: [],
                DELETE: [],
            },
        };
        let appWrapper: Wrapper<any>;
        beforeEach(async () => {
            let currentState = ApplicationMock.getCurrentState();
            ApplicationMock.getCurrentState.callsFake(
                (): ApplicationMainStateJSON => ({
                    ...currentState,
                    rewriteRuleEntries: [entity],
                }),
            );
            ApplicationMock.getRewriteRules.resolves([entity]);
            appWrapper = createAppMock();
            appWrapper
                .find(TabContents)
                .vm["changeTabIndex"](HeaderTabNameToIndex["Rewrite rule"]);
            appWrapper
                .find(RewriteRule)
                .vm["onClickModifiersButton"](entity.id);
            await appWrapper.vm.$nextTick();
        });

        it("addRewriteRuleModifier DELETE", async () => {
            let deleteModifiersTable = appWrapper.find(DeleteModifiersTable);
            deleteModifiersTable.vm["currentHeader"] = "content-type";
            deleteModifiersTable.vm["addModifier"]();

            assert(ApplicationMock.addRewriteRuleModifier.calledOnce);
            let call = ApplicationMock.addRewriteRuleModifier.lastCall;
            assert(call.args[0] === "DELETE");
            assert(call.args[1] === entity.id);
            assert(call.args[2].header === "content-type");
        });

        it("deleteRewriteRuleModifiers DELETE", async () => {
            let deleteModifiersTable = appWrapper.find(DeleteModifiersTable);
            deleteModifiersTable.vm["onClickDeleteButton"](entity);

            assert(ApplicationMock.deleteRewriteRuleModifiers.calledOnce);
            let call = ApplicationMock.deleteRewriteRuleModifiers.lastCall;
            assert(call.args[0] === "DELETE");
            assert(call.args[1] === entity.id);
            assert(call.args[2][0] === entity);
        });

        it("addRewriteRuleModifier UPDATE", async () => {
            let deleteModifiersTable = appWrapper.find(UpdateModifiersTable);
            deleteModifiersTable.vm["currentHeader"] = "content-type";
            deleteModifiersTable.vm["currentValue"] = "text/plain";
            deleteModifiersTable.vm["addModifier"]();

            assert(ApplicationMock.addRewriteRuleModifier.calledOnce);
            let call = ApplicationMock.addRewriteRuleModifier.lastCall;
            assert(call.args[0] === "UPDATE");
            assert(call.args[1] === entity.id);
            assert(call.args[2].header === "content-type");
            assert(call.args[2].value === "text/plain");
        });

        it("deleteRewriteRuleModifiers UPDATE", async () => {
            let deleteModifiersTable = appWrapper.find(UpdateModifiersTable);
            deleteModifiersTable.vm["onClickDeleteButton"](entity);

            assert(ApplicationMock.deleteRewriteRuleModifiers.calledOnce);
            let call = ApplicationMock.deleteRewriteRuleModifiers.lastCall;
            assert(call.args[0] === "UPDATE");
            assert(call.args[1] === entity.id);
            assert(call.args[2][0] === entity);
        });
    });
});
