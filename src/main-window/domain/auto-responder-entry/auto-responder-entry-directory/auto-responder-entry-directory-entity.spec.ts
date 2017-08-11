import * as Path from "path";
import {AutoResponderEntryFactory} from "../lifecycle/auto-responder-entry-factory";
import {getLifecycleContextService} from "../../../../../test/main-window/mocks";
import {ClientRequestUrl} from "../../client-request/value-objects/client-request-url";
import {AutoResponderEntryDirectoryEntity} from "./auto-responder-entry-directory-entity";

describe('AutoResponderEntryDirectoryEntity', () => {
    let autoResponderEntryDirectoryEntity: AutoResponderEntryDirectoryEntity;

    beforeEach(() => {
        let autoResponderEntryFactory = getLifecycleContextService().autoResponderEntryFactory;
        autoResponderEntryDirectoryEntity = <AutoResponderEntryDirectoryEntity>autoResponderEntryFactory.create("Directory", Path.basename(__dirname), __dirname);
    });

    describe('getMatchResponder', () => {
        it('file exist', async () => {
            let url = `/${Path.basename(__dirname)}/${Path.basename(__filename)}`;
            let result = await autoResponderEntryDirectoryEntity.getMatchResponder(new ClientRequestUrl(url));
            expect(result.path).toBe(__filename);
        });

        it('file not exist', async () => {
            let url = `/${Path.basename(__dirname)}/not_exist.txt`;
            let result = await autoResponderEntryDirectoryEntity.getMatchResponder(new ClientRequestUrl(url));
            expect(result).toBeUndefined();
        });

        it('unmatch', async () => {
            let url = `/unknown-dir/${Path.basename(__filename)}`;
            let result = await autoResponderEntryDirectoryEntity.getMatchResponder(new ClientRequestUrl(url));
            expect(result).toBeUndefined();
        });
    });
});
