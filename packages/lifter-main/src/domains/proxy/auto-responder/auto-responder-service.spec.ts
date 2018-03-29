import * as assert from "assert";
import "mocha";
import { createApplication } from "../../../../test/mocks/create-services";
import { LifecycleContextService } from "../../../application/lifecycle-context-service";
import { AutoResponderService } from "./auto-responder-service";

describe("AutoResponderService", () => {
    let lifecycleContextService: LifecycleContextService;
    let autoResponderService: AutoResponderService;

    beforeEach(async () => {
        let application = await createApplication();
        lifecycleContextService = application.getLifecycleContextService();
        autoResponderService = application.getServiceContext().autoResponderService;
    });

    it("getAutoResponder.add", async () => {
        let autoResponder = autoResponderService.getAutoResponder();
        let results = await autoResponder.add([__filename]);
        assert(results[0].type === "File");
        assert(results[0].path === __filename);

        let fetchResults = await autoResponder.fetchAll();
        assert(fetchResults.length === 1);
        assert(fetchResults[0].type === "File");
        assert(fetchResults[0].path === __filename);
    });

    it("getAutoResponder.fetchAll", async () => {
        let autoResponder = autoResponderService.getAutoResponder();
        assert((await autoResponder.fetchAll()).length === 0);

        await autoResponder.add([__filename]);

        assert((await autoResponder.fetchAll()).length === 1);
    });

    it("getAutoResponder.delete", async () => {
        let autoResponder = autoResponderService.getAutoResponder();
        await autoResponder.add([__filename]);

        let fetchResults = await autoResponder.fetchAll();

        await autoResponder.deletes(fetchResults.map(res => res.id));

        assert((await autoResponder.fetchAll()).length === 0);
    });

    it("find result is null", async () => {
        let clientRequestEntity = lifecycleContextService.clientRequestFactory.createFromString("");
        let result = await autoResponderService.find(clientRequestEntity);
        assert(!result);
    });

    it("find result is not null", async () => {
        await autoResponderService.store([__filename]);
        let clientRequestEntity = lifecycleContextService.clientRequestFactory.createFromString(__filename);
        let result = await autoResponderService.find(clientRequestEntity);
        assert(result);
    });

    it("find choose from entities", async () => {
        let entities = Array.from(Array(10)).map((_, index) =>
            lifecycleContextService.autoResponderFactory.create("File", String(index), __filename),
        );
        await lifecycleContextService.autoResponderRepository.storeList(entities);

        let clientRequestEntity = lifecycleContextService.clientRequestFactory.createFromString("/2");
        let result = await autoResponderService.find(clientRequestEntity);
        assert(result);
    });
});
