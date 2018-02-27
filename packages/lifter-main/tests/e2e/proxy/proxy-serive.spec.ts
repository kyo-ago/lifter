import * as assert from "assert";
import "mocha";

import { Application } from "../../../src/application/application";
import { ProxyService } from "../../../src/application/proxy/proxy-service";
import { createApplication } from "../../mocks/create-services";

describe("ProxyService", () => {
    it("start", async () => {
        try {
            let application = await createApplication();
            await application.start(() => { });
            await application.quit();
        } catch (e) {
            assert.fail(e);
        }
    });

    it("getMainState", async () => {
        let application = await createApplication();
        let mainState = await application.getMainState();
        assert(mainState);
    });
});
