import * as assert from "assert";
import "mocha";
import { createApplication } from "../../../../tests/mocks/create-services";
import { LifecycleContextService } from "../../../application/lifecycle-context-service";
import { AutoResponderService } from "./auto-responder-service";

describe("AutoResponderService", () => {
    let lifecycleContextService: LifecycleContextService;
    let autoResponderService: AutoResponderService;

    beforeEach(async () => {
        let application = await createApplication();
        lifecycleContextService = application.lifecycleContextService;
        autoResponderService = application.getAutoResponderService();
    });

    describe("find", () => {
        it("result is null", async () => {
            let clientRequestEntity = lifecycleContextService.clientRequestFactory.createFromString("");
            let result = await autoResponderService.find(clientRequestEntity);
            assert(!result);
        });
        it("result is not null", async () => {
            await autoResponderService.store([__filename]);
            let clientRequestEntity = lifecycleContextService.clientRequestFactory.createFromString(__filename);
            let result = await autoResponderService.find(clientRequestEntity);
            assert(result);
        });
        it("choose from entities", async () => {
            let entities = Array.from(Array(10)).map((_, index) =>
                lifecycleContextService.autoResponderFactory.create("File", String(index), __filename),
            );
            await lifecycleContextService.autoResponderRepository.storeList(entities);

            let clientRequestEntity = lifecycleContextService.clientRequestFactory.createFromString("/2");
            let result = await autoResponderService.find(clientRequestEntity);
            assert(result);
        });
    });
});
