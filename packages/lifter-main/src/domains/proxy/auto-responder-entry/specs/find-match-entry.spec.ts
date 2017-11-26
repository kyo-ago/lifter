import { getLifecycleContextService } from "../../../../../tests/mocks/main-window/get-lifecycle-context-service";
import { ClientRequestFactory } from "../../client-request/lifecycle/client-request-factory";
import { LocalFileResponderFactory } from "../../local-file-responder/lifecycle/local-file-responder-factory";
import { AutoResponderEntryFactory } from "../lifecycle/auto-responder-entry-factory";
import { FindMatchEntry } from "./find-match-entry";

describe("FindMatchEntry.getLocalFileResponder", () => {
    let autoResponderEntryFactory: AutoResponderEntryFactory;
    let localFileResponderFactory: LocalFileResponderFactory;
    let clientRequestFactory: ClientRequestFactory;
    beforeEach(async () => {
        let lifecycleContextService = await getLifecycleContextService();
        autoResponderEntryFactory = lifecycleContextService.autoResponderEntryFactory;
        localFileResponderFactory = lifecycleContextService.localFileResponderFactory;
        clientRequestFactory = lifecycleContextService.clientRequestFactory;
    });

    it("success", async () => {
        let abstractAutoResponderEntryEntity = await autoResponderEntryFactory.create("File", "/hoge", __filename);
        let findMatchEntry = new FindMatchEntry(
            localFileResponderFactory,
            clientRequestFactory.createFromString("/hoge")
        );
        let localFileResponderEntity = await findMatchEntry.getLocalFileResponder(
            Promise.resolve(null),
            abstractAutoResponderEntryEntity
        );
        expect(localFileResponderEntity).not.toBeNull();
    });

    it("failed", async () => {
        let abstractAutoResponderEntryEntity = await autoResponderEntryFactory.create("File", "/hoge", __filename);
        let findMatchEntry = new FindMatchEntry(
            localFileResponderFactory,
            clientRequestFactory.createFromString("/huga")
        );
        let localFileResponderEntity = await findMatchEntry.getLocalFileResponder(
            Promise.resolve(null),
            abstractAutoResponderEntryEntity
        );
        expect(localFileResponderEntity).toBeNull();
    });
});
