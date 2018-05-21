import * as assert from "assert";
import "mocha";
import { getTestContainer } from "../../../../../test/mocks/get-test-container";
import { AutoResponderGlobEntity } from "../auto-responder-glob/auto-responder-glob-entity";
import { AutoResponderFactory } from "./auto-responder-factory";

describe("AutoResponderFactory", () => {
    let autoResponderFactory: AutoResponderFactory;

    beforeEach(async () => {
        autoResponderFactory = (await getTestContainer()).get(
            AutoResponderFactory,
        );
    });

    describe("create", () => {
        it("Glob", () => {
            let autoResponderFileEntity = autoResponderFactory.create(
                "auto-responder-factory.spec.ts",
                "./auto-responder-factory.spec.ts",
            );
            assert(autoResponderFileEntity instanceof AutoResponderGlobEntity);
        });
    });
});
