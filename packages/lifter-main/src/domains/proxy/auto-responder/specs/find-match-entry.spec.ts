import * as assert from "assert";
import "mocha";
import { createLifecycleContextService } from "../../../../../tests/mocks/create-services";
import { ClientRequestFactory } from "../../client-request/lifecycle/client-request-factory";
import { LocalFileResponderFactory } from "../../local-file-responder/lifecycle/local-file-responder-factory";
import { AutoResponderFactory } from "../lifecycle/auto-responder-factory";
import { FindMatchEntry } from "./find-match-entry";

describe("FindMatchEntry.getLocalFileResponder", () => {
    let autoResponderFactory: AutoResponderFactory;
    let localFileResponderFactory: LocalFileResponderFactory;
    let clientRequestFactory: ClientRequestFactory;
    beforeEach(async () => {
        let lifecycleContextService = await createLifecycleContextService();
        autoResponderFactory = lifecycleContextService.autoResponderFactory;
        localFileResponderFactory = lifecycleContextService.localFileResponderFactory;
        clientRequestFactory = lifecycleContextService.clientRequestFactory;
    });

    it("success", async () => {
        let abstractAutoResponderEntity = await autoResponderFactory.create("File", "/hoge", __filename);
        let findMatchEntry = new FindMatchEntry(
            localFileResponderFactory,
            clientRequestFactory.createFromString("/hoge"),
        );
        let localFileResponderEntity = await findMatchEntry.getLocalFileResponder(
            Promise.resolve(null),
            abstractAutoResponderEntity,
        );
        assert(localFileResponderEntity);
    });

    it("failed", async () => {
        let abstractAutoResponderEntity = await autoResponderFactory.create("File", "/hoge", __filename);
        let findMatchEntry = new FindMatchEntry(
            localFileResponderFactory,
            clientRequestFactory.createFromString("/huga"),
        );
        let localFileResponderEntity = await findMatchEntry.getLocalFileResponder(
            Promise.resolve(null),
            abstractAutoResponderEntity,
        );
        assert(!localFileResponderEntity);
    });
});
