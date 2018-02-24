import * as assert from "assert";
import "mocha";
import * as Path from "path";
import { createLifecycleContextService } from "../../../../../tests/mocks/create-services";
import { ClientRequestFactory } from "../../client-request/lifecycle/client-request-factory";
import { AutoResponderEntryDirectoryEntity } from "./auto-responder-entry-directory-entity";

describe("AutoResponderEntryDirectoryEntity", () => {
    let autoResponderEntryDirectoryEntity: AutoResponderEntryDirectoryEntity;
    let clientRequestFactory: ClientRequestFactory;

    beforeEach(async () => {
        let lifecycleContextService = await createLifecycleContextService();
        let autoResponderEntryFactory = lifecycleContextService.autoResponderFactory;
        clientRequestFactory = lifecycleContextService.clientRequestFactory;
        autoResponderEntryDirectoryEntity = <AutoResponderEntryDirectoryEntity>autoResponderEntryFactory.create(
            "Directory",
            Path.basename(__dirname),
            __dirname,
        );
    });

    describe("getMatchResponder", () => {
        it("file exist", async () => {
            let url = `/${Path.basename(__dirname)}/${Path.basename(__filename)}`;
            let clientRequestEntity = clientRequestFactory.createFromString(url);
            let result = await autoResponderEntryDirectoryEntity.getMatchResponder(clientRequestEntity);
            assert(result.path === __filename);
        });

        it("file not exist", async () => {
            let url = `/${Path.basename(__dirname)}/not_exist.txt`;
            let clientRequestEntity = clientRequestFactory.createFromString(url);
            let result = await autoResponderEntryDirectoryEntity.getMatchResponder(clientRequestEntity);
            assert(!result);
        });

        it("unmatch", async () => {
            let url = `/unknown-dir/${Path.basename(__filename)}`;
            let clientRequestEntity = clientRequestFactory.createFromString(url);
            let result = await autoResponderEntryDirectoryEntity.getMatchResponder(clientRequestEntity);
            assert(!result);
        });
    });
});
