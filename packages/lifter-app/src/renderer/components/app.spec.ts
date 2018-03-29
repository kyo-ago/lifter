import { createAppMock } from "./app.mock";
import * as assert from "assert";
import "mocha";

describe("app.vue", () => {
    it("create", () => {
        let appWrapper = createAppMock();
        assert(appWrapper.find(".el-container").exists());
    });
});
