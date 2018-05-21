import * as assert from "assert";
import "mocha";
import { getTestContainer } from "../../../../test/mocks/get-test-container";
import { ClientRequestFactory } from "../client-request/lifecycle/client-request-factory";
import { AutoResponderService } from "./auto-responder-service";
import { AutoResponderFactory } from "./lifecycle/auto-responder-factory";
import { AutoResponderRepository } from "./lifecycle/auto-responder-repositoty";

describe("AutoResponderService", () => {
    let clientRequestFactory: ClientRequestFactory;
    let autoResponderFactory: AutoResponderFactory;
    let autoResponderRepository: AutoResponderRepository;
    let autoResponderService: AutoResponderService;

    beforeEach(async () => {
        let container = await getTestContainer();
        clientRequestFactory = container.get(ClientRequestFactory);
        autoResponderFactory = container.get(AutoResponderFactory);
        autoResponderRepository = container.get(AutoResponderRepository);
        autoResponderService = container.get(AutoResponderService);
    });

    it("getAutoResponder.add", async () => {
        let autoResponder = autoResponderService.getAutoResponder();
        let results = await autoResponder.add([__filename]);
        assert(results[0].path === __filename);

        let fetchResults = await autoResponder.fetchAll();
        assert(fetchResults.length === 1);
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
        let clientRequestEntity = clientRequestFactory.createFromString("");
        let result = await autoResponderService.find(clientRequestEntity);
        assert(!result);
    });

    it("find result is not null", async () => {
        await autoResponderService.store([__filename]);
        let clientRequestEntity = clientRequestFactory.createFromString(
            __filename,
        );
        let result = await autoResponderService.find(clientRequestEntity);
        assert(result);
    });

    it("find choose from entities", async () => {
        let entities = Array.from(Array(10)).map((_, index) =>
            autoResponderFactory.create(String(index), __filename),
        );
        await autoResponderRepository.storeList(entities);

        let clientRequestEntity = clientRequestFactory.createFromString("/2");
        let result = await autoResponderService.find(clientRequestEntity);
        assert(result);
    });
});
