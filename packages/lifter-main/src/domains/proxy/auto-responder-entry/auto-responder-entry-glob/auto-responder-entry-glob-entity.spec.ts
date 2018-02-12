import * as assert from "assert";
import "mocha";
import * as Path from "path";
import { createLifecycleContextService } from "../../../../../tests/mocks/create-services";
import { ClientRequestFactory } from "../../client-request/lifecycle/client-request-factory";
import { AutoResponderEntryFactory } from "../lifecycle/auto-responder-entry-factory";
import { AutoResponderEntryGlobEntity } from "./auto-responder-entry-glob-entity";

describe("AutoResponderEntryGlobEntity.getMatchResponder", () => {
    let autoResponderEntryFactory: AutoResponderEntryFactory;
    let clientRequestFactory: ClientRequestFactory;
    beforeEach(async () => {
        let lifecycleContextService = await createLifecycleContextService();
        autoResponderEntryFactory = lifecycleContextService.autoResponderEntryFactory;
        clientRequestFactory = lifecycleContextService.clientRequestFactory;
    });
    let createAutoResponderEntryGlobEntity = (pattern: string, path: string): AutoResponderEntryGlobEntity => {
        return <AutoResponderEntryGlobEntity>autoResponderEntryFactory.create("Glob", pattern, path);
    };

    it("file path", async () => {
        let autoResponderEntryGlobEntity = createAutoResponderEntryGlobEntity("/*", __filename);
        let clientRequestEntity = clientRequestFactory.createFromString("/hoge");
        let result = await autoResponderEntryGlobEntity.getMatchResponder(clientRequestEntity);
        assert(result.path === __filename);
    });

    it("directory path", async () => {
        let filename = Path.basename(__filename);
        let autoResponderEntryGlobEntity = createAutoResponderEntryGlobEntity("/*", __dirname);
        let clientRequestEntity = clientRequestFactory.createFromString(`/${filename}`);
        let result = await autoResponderEntryGlobEntity.getMatchResponder(clientRequestEntity);
        assert(result.path === __filename);
    });
});
