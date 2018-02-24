import * as assert from "assert";
import "mocha";
import { createLifecycleContextService } from "../../../../../tests/mocks/create-services";
import { ClientRequestFactory } from "../../client-request/lifecycle/client-request-factory";
import { AutoResponderFactory } from "./auto-responder-factory";
import { AutoResponderRepository } from "./auto-responder-repositoty";

describe("AutoResponderRepository", () => {
    let autoResponderRepository: AutoResponderRepository;
    let autoResponderFactory: AutoResponderFactory;
    let clientRequestFactory: ClientRequestFactory;

    beforeEach(async () => {
        let lifecycleContextService = await createLifecycleContextService();
        autoResponderRepository = lifecycleContextService.autoResponderRepository;
        autoResponderFactory = lifecycleContextService.autoResponderFactory;
        clientRequestFactory = lifecycleContextService.clientRequestFactory;
    });

    describe("findMatchEntry", () => {
        it("result is null", async () => {
            let clientRequestEntity = clientRequestFactory.createFromString("");
            let result = await autoResponderRepository.findMatchEntry(clientRequestEntity);
            assert(!result);
        });
        it("result is not null", async () => {
            await autoResponderRepository.store(autoResponderFactory.create("File", "a", __filename));
            let clientRequestEntity = clientRequestFactory.createFromString("/a");
            let result = await autoResponderRepository.findMatchEntry(clientRequestEntity);
            assert(result);
        });
        it("choose from entities", async () => {
            let entities = Array.from(Array(10)).map((_, index) =>
                autoResponderFactory.create("File", String(index), __filename),
            );
            await autoResponderRepository.storeList(entities);
            let clientRequestEntity = clientRequestFactory.createFromString("/2");
            let result = await autoResponderRepository.findMatchEntry(clientRequestEntity);
            assert(result);
        });
    });
});
