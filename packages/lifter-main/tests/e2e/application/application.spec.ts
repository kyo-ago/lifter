import * as assert from "assert";
import "mocha";
import "../../mocks/require-mocks";

import { Application } from "../../../src/application/application";
import { LifecycleContextService } from "../../../src/application/lifecycle-context-service";
import { createProjectEntity } from "../../mocks/create-services";

describe("Application", () => {
    let createApplication = () => {
        let projectEntity = createProjectEntity();
        return new Application(
            '',
            projectEntity,
            new LifecycleContextService(projectEntity)
        );
    };

    it("start -> quit", async () => {
        try {
            let application = createApplication();
            await application.load();
            await application.start(() => { });
            await application.quit();
        } catch (e) {
            assert.fail(e);
        }
    });

    it("getMainState", async () => {
        let application = createApplication();
        await application.load();
        let mainState = await application.getMainState();
        assert(mainState);
    });
});
