import * as assert from "assert";
import "mocha";
import * as Path from "path";
import { getTestContainer } from "../../../../test/mocks/get-test-container";
import { ClientRequestFactory } from "../client-request/lifecycle/client-request-factory";
import { AutoResponderEntity } from "./auto-responder-entity";
import { AutoResponderFactory } from "./lifecycle/auto-responder-factory";

describe("AutoResponderEntity.getMatchResponder", () => {
    let autoResponderFactory: AutoResponderFactory;
    let clientRequestFactory: ClientRequestFactory;
    beforeEach(async () => {
        let container = await getTestContainer();
        autoResponderFactory = container.get(AutoResponderFactory);
        clientRequestFactory = container.get(ClientRequestFactory);
    });
    let createAutoResponderGlobEntity = (
        pattern: string,
        path: string,
    ): AutoResponderEntity => {
        return <AutoResponderEntity>autoResponderFactory.create(pattern, path);
    };

    it("file path", async () => {
        let autoResponderGlobEntity = createAutoResponderGlobEntity(
            "/*",
            __filename,
        );
        let clientRequestEntity = clientRequestFactory.createFromString(
            "/hoge",
        );
        let result = await autoResponderGlobEntity.getMatchResponder(
            clientRequestEntity,
        );
        assert(result.path === __filename);
    });

    it("directory path", async () => {
        let filename = Path.basename(__filename);
        let autoResponderGlobEntity = createAutoResponderGlobEntity(
            "/*",
            __dirname,
        );
        let clientRequestEntity = clientRequestFactory.createFromString(
            `/${filename}`,
        );
        let result = await autoResponderGlobEntity.getMatchResponder(
            clientRequestEntity,
        );
        assert(result.path === __filename);
    });
});
