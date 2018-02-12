import * as assert from "assert";
import * as Path from "path";
import { Application } from "spectron";

describe("application launch", () => {
    let application: Application;
    beforeAll(() => {
        application = new Application({
            path: `${Path.join(".", "node_modules", ".bin", "electron")}`,
            args: [Path.join(".")],
        });
        return application.start();
    });

    afterAll(() => {
        if (application && application.isRunning()) {
            return application.stop();
        }
    });

    it("shows an initial window", async () => {
        let count = await application.client.getWindowCount();
        assert.equal(count, 1);
    });

    it("get text", async () => {
        let text = await (<any>application.client).getText("body");
        assert(text);
    });
});
