import * as assert from "assert";
import * as Path from "path";
import { getLifecycleContextService } from "../../../../../tests/mocks/main-window/get-lifecycle-context-service";
import { ClientRequestFactory } from "../../client-request/lifecycle/client-request-factory";
import { AutoResponderEntryFactory } from "../lifecycle/auto-responder-entry-factory";

describe("AutoResponderEntryFileEntity", () => {
    let autoResponderEntryFactory: AutoResponderEntryFactory;
    let clientRequestFactory: ClientRequestFactory;

    beforeEach(async () => {
        let lifecycleContextService = await getLifecycleContextService();
        autoResponderEntryFactory = lifecycleContextService.autoResponderEntryFactory;
        clientRequestFactory = lifecycleContextService.clientRequestFactory;
    });

    describe("getMatchResponder", () => {
        it("match filename", async () => {
            let filename = Path.basename(__filename);
            let autoResponderEntryDirectoryEntity = autoResponderEntryFactory.create("File", filename, __filename);
            let clientRequestEntity = clientRequestFactory.createFromString(`/hgoe/${filename}`);
            let result = await autoResponderEntryDirectoryEntity.getMatchResponder(clientRequestEntity);
            assert(result.path === __filename);
        });
        it("match url", async () => {
            let autoResponderEntryDirectoryEntity = autoResponderEntryFactory.create("File", "a", __filename);
            let clientRequestEntity = clientRequestFactory.createFromString(`/a`);
            let result = await autoResponderEntryDirectoryEntity.getMatchResponder(clientRequestEntity);
            assert(result.path === __filename);
        });
        it("unmatch", async () => {
            let autoResponderEntryDirectoryEntity = autoResponderEntryFactory.create("File", "aaaa", __filename);
            let clientRequestEntity = clientRequestFactory.createFromString(`/a`);
            let result = await autoResponderEntryDirectoryEntity.getMatchResponder(clientRequestEntity);
            assert(!result);
        });
    });
});
