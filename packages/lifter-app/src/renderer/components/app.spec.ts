import { ApplicationMock } from "../application/application.mock";
import { createAppMock } from "./app.mock";
import * as assert from "assert";
import "mocha";

describe("app.vue", () => {
    it("create", () => {
        let appWrapper = createAppMock();
        assert(appWrapper.find(".el-container").exists());
    });
    it("changeProxySettingStatus", async () => {
        let appWrapper = createAppMock();

        let target = appWrapper.find('[data-test="changeProxySettingStatus"]');

        assert(target.attributes()["data-test-type"] === "info");

        target.trigger('click');

        await new Promise(setTimeout);

        assert(ApplicationMock.changeProxySettingStatus.calledOnce);
        assert(target.attributes()["data-test-type"] === "primary");
    });
});
