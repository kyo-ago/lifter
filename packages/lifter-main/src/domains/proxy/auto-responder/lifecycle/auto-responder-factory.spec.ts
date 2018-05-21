import * as assert from "assert";
import "mocha";
import { getTestContainer } from "../../../../../test/mocks/get-test-container";
import { AutoResponderEntity } from "../auto-responder-entity";
import { AutoResponderFactory } from "./auto-responder-factory";

describe("AutoResponderFactory", () => {
    let autoResponderFactory: AutoResponderFactory;

    beforeEach(async () => {
        autoResponderFactory = (await getTestContainer()).get(
            AutoResponderFactory,
        );
    });

    it("create", () => {
        let autoResponderFileEntity = autoResponderFactory.create(
            "auto-responder-factory.spec.ts",
            "./auto-responder-factory.spec.ts",
        );
        assert(autoResponderFileEntity instanceof AutoResponderEntity);
    });
});
