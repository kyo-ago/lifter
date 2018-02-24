import * as assert from "assert";
import "mocha";
import * as Path from "path";
import { createLifecycleContextService } from "../../../../../tests/mocks/create-services";
import { ClientRequestFactory } from "../../client-request/lifecycle/client-request-factory";
import { AutoResponderFactory } from "../lifecycle/auto-responder-factory";

describe("AutoResponderFileEntity", () => {
    let autoResponderFactory: AutoResponderFactory;
    let clientRequestFactory: ClientRequestFactory;

    beforeEach(async () => {
        let lifecycleContextService = await createLifecycleContextService();
        autoResponderFactory = lifecycleContextService.autoResponderFactory;
        clientRequestFactory = lifecycleContextService.clientRequestFactory;
    });

    describe("getMatchResponder", () => {
        it("match filename", async () => {
            let filename = Path.basename(__filename);
            let autoResponderFileEntity = autoResponderFactory.create("File", filename, __filename);
            let clientRequestEntity = clientRequestFactory.createFromString(`/hgoe/${filename}`);
            let result = await autoResponderFileEntity.getMatchResponder(clientRequestEntity);
            assert(result.path === __filename);
        });
        it("match url", async () => {
            let autoResponderFileEntity = autoResponderFactory.create("File", "a", __filename);
            let clientRequestEntity = clientRequestFactory.createFromString(`/a`);
            let result = await autoResponderFileEntity.getMatchResponder(clientRequestEntity);
            assert(result.path === __filename);
        });
        it("unmatch", async () => {
            let autoResponderFileEntity = autoResponderFactory.create("File", "aaaa", __filename);
            let clientRequestEntity = clientRequestFactory.createFromString(`/a`);
            let result = await autoResponderFileEntity.getMatchResponder(clientRequestEntity);
            assert(!result);
        });
    });
});
