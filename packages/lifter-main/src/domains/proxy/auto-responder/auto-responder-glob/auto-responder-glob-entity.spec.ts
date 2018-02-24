import * as assert from "assert";
import "mocha";
import * as Path from "path";
import { createLifecycleContextService } from "../../../../../tests/mocks/create-services";
import { ClientRequestFactory } from "../../client-request/lifecycle/client-request-factory";
import { AutoResponderFactory } from "../lifecycle/auto-responder-factory";
import { AutoResponderGlobEntity } from "./auto-responder-glob-entity";

describe("AutoResponderGlobEntity.getMatchResponder", () => {
    let autoResponderFactory: AutoResponderFactory;
    let clientRequestFactory: ClientRequestFactory;
    beforeEach(async () => {
        let lifecycleContextService = await createLifecycleContextService();
        autoResponderFactory = lifecycleContextService.autoResponderFactory;
        clientRequestFactory = lifecycleContextService.clientRequestFactory;
    });
    let createAutoResponderGlobEntity = (pattern: string, path: string): AutoResponderGlobEntity => {
        return <AutoResponderGlobEntity>autoResponderFactory.create("Glob", pattern, path);
    };

    it("file path", async () => {
        let autoResponderGlobEntity = createAutoResponderGlobEntity("/*", __filename);
        let clientRequestEntity = clientRequestFactory.createFromString("/hoge");
        let result = await autoResponderGlobEntity.getMatchResponder(clientRequestEntity);
        assert(result.path === __filename);
    });

    it("directory path", async () => {
        let filename = Path.basename(__filename);
        let autoResponderGlobEntity = createAutoResponderGlobEntity("/*", __dirname);
        let clientRequestEntity = clientRequestFactory.createFromString(`/${filename}`);
        let result = await autoResponderGlobEntity.getMatchResponder(clientRequestEntity);
        assert(result.path === __filename);
    });
});
