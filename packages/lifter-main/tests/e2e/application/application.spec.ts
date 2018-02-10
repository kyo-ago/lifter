import "mocha";
import * as assert from "assert";
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

    it("new", () => {
        assert(createApplication());
    });

    it("load", async () => {
        assert.doesNotThrow(async () => {
            await createApplication().load();
        });
    });

    it("start", async () => {
        assert.doesNotThrow(async () => {
            let application = createApplication();
            await application.load();
            await application.start(() => { });
        });
    });
});
