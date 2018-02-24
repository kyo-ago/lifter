import { AutoResponderEntryType } from "@lifter/lifter-common";
import * as assert from "assert";
import "mocha";
import { createLifecycleContextService } from "../../../../../tests/mocks/create-services";
import { AutoResponderEntryDirectoryEntity } from "../auto-responder-entry-directory/auto-responder-entry-directory-entity";
import { AutoResponderEntryFileEntity } from "../auto-responder-entry-file/auto-responder-entry-file-entity";
import { AutoResponderEntryGlobEntity } from "../auto-responder-entry-glob/auto-responder-entry-glob-entity";
import { AutoResponderEntryFactory } from "./auto-responder-entry-factory";

describe("AutoResponderEntryFactory", () => {
    let autoResponderEntryFactory: AutoResponderEntryFactory;

    beforeEach(async () => {
        let lifecycleContextService = await createLifecycleContextService();
        autoResponderEntryFactory = lifecycleContextService.autoResponderEntryFactory;
    });

    describe("create", () => {
        [
            {
                type: "File",
                instance: AutoResponderEntryFileEntity,
            },
            {
                type: "Directory",
                instance: AutoResponderEntryDirectoryEntity,
            },
            {
                type: "Glob",
                instance: AutoResponderEntryGlobEntity,
            },
        ].forEach((param: { type: AutoResponderEntryType; instance: any }) => {
            it(param.type, () => {
                let autoResponderEntryFileEntity = autoResponderEntryFactory.create(
                    param.type,
                    "auto-responder-entry-factory.spec.ts",
                    "./auto-responder-entry-factory.spec.ts",
                );
                assert(autoResponderEntryFileEntity instanceof param.instance);
            });
        });
    });
});
