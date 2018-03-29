import * as assert from "assert";
import "mocha";
import * as Path from "path";
import { createLifecycleContextService } from "../../../../../test/mocks/create-services";
import { ClientRequestFactory } from "../../client-request/lifecycle/client-request-factory";
import { AutoResponderDirectoryEntity } from "./auto-responder-directory-entity";

describe("AutoResponderDirectoryEntity", () => {
    let autoResponderDirectoryEntity: AutoResponderDirectoryEntity;
    let clientRequestFactory: ClientRequestFactory;

    beforeEach(async () => {
        let lifecycleContextService = await createLifecycleContextService();
        let autoResponderFactory = lifecycleContextService.autoResponderFactory;
        clientRequestFactory = lifecycleContextService.clientRequestFactory;
        autoResponderDirectoryEntity = <AutoResponderDirectoryEntity>autoResponderFactory.create(
            "Directory",
            Path.basename(__dirname),
            __dirname,
        );
    });

    describe("getMatchResponder", () => {
        it("file exist", async () => {
            let url = `/${Path.basename(__dirname)}/${Path.basename(__filename)}`;
            let clientRequestEntity = clientRequestFactory.createFromString(url);
            let result = await autoResponderDirectoryEntity.getMatchResponder(clientRequestEntity);
            assert(result.path === __filename);
        });

        it("file not exist", async () => {
            let url = `/${Path.basename(__dirname)}/not_exist.txt`;
            let clientRequestEntity = clientRequestFactory.createFromString(url);
            let result = await autoResponderDirectoryEntity.getMatchResponder(clientRequestEntity);
            assert(!result);
        });

        it("unmatch", async () => {
            let url = `/unknown-dir/${Path.basename(__filename)}`;
            let clientRequestEntity = clientRequestFactory.createFromString(url);
            let result = await autoResponderDirectoryEntity.getMatchResponder(clientRequestEntity);
            assert(!result);
        });
    });
});
