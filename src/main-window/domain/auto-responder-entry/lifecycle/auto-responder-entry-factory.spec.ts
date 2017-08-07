import {getLifecycleContextService} from "../../../../../test/main-window/mocks";
import {AutoResponderEntryDirectoryEntity} from "../auto-responder-entry-directory-entity";
import {AutoResponderEntryType} from "../auto-responder-entry-entity";
import {AutoResponderEntryFileEntity} from "../auto-responder-entry-file-entity";
import {AutoResponderEntryGlobEntity} from "../auto-responder-entry-glob-entity";
import {AutoResponderEntryFactory} from "./auto-responder-entry-factory";

describe('AutoResponderEntryFactory', () => {
    let autoResponderEntryFactory: AutoResponderEntryFactory;

    beforeEach(() => {
        let lifecycleContextService = getLifecycleContextService();
        autoResponderEntryFactory = lifecycleContextService.autoResponderEntryFactory;
    });

    describe('create', () => {
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
        ].forEach((param: { type: AutoResponderEntryType; instance: any; }) => {
            it(param.type, () => {
                let autoResponderEntryFileEntity = autoResponderEntryFactory.create(param.type, 'auto-responder-entry-factory.spec.ts', './auto-responder-entry-factory.spec.ts');
                expect(autoResponderEntryFileEntity).toBeInstanceOf(param.instance);
            });
        });
    });
});
