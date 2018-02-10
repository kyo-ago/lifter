import "mocha";
import * as assert from "assert";
import { createLifecycleContextService } from "../../../../../tests/mocks/create-services";
import { ClientRequestFactory } from "../../client-request/lifecycle/client-request-factory";
import { AutoResponderEntryFactory } from "./auto-responder-entry-factory";
import { AutoResponderEntryRepository } from "./auto-responder-entry-repositoty";

describe("AutoResponderEntryRepository", () => {
    let autoResponderEntryRepository: AutoResponderEntryRepository;
    let autoResponderEntryFactory: AutoResponderEntryFactory;
    let clientRequestFactory: ClientRequestFactory;

    beforeEach(async () => {
        let lifecycleContextService = await createLifecycleContextService();
        autoResponderEntryRepository = lifecycleContextService.autoResponderEntryRepository;
        autoResponderEntryFactory = lifecycleContextService.autoResponderEntryFactory;
        clientRequestFactory = lifecycleContextService.clientRequestFactory;
    });

    describe("findMatchEntry", () => {
        it("result is null", async () => {
            let clientRequestEntity = clientRequestFactory.createFromString("");
            let result = await autoResponderEntryRepository.findMatchEntry(clientRequestEntity);
            assert(!result);
        });
        it("result is not null", async () => {
            await autoResponderEntryRepository.store(autoResponderEntryFactory.create("File", "a", __filename));
            let clientRequestEntity = clientRequestFactory.createFromString("/a");
            let result = await autoResponderEntryRepository.findMatchEntry(clientRequestEntity);
            assert(result);
        });
        it("choose from entities", async () => {
            let entities = Array.from(Array(10)).map((_, index) =>
                autoResponderEntryFactory.create("File", String(index), __filename),
            );
            await autoResponderEntryRepository.storeList(entities);
            let clientRequestEntity = clientRequestFactory.createFromString("/2");
            let result = await autoResponderEntryRepository.findMatchEntry(clientRequestEntity);
            assert(result);
        });
    });
});
