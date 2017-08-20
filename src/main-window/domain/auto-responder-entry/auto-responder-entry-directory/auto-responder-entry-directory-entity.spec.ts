import * as Path from "path";
import {getLifecycleContextService} from "../../../../../test/main-window/mocks";
import {ClientRequestFactory} from "../../client-request/lifecycle/client-request-factory";
import {AutoResponderEntryDirectoryEntity} from "./auto-responder-entry-directory-entity";

describe('AutoResponderEntryDirectoryEntity', () => {
    let autoResponderEntryDirectoryEntity: AutoResponderEntryDirectoryEntity;
    let clientRequestFactory: ClientRequestFactory;

    beforeEach(() => {
        let lifecycleContextService = getLifecycleContextService();
        let autoResponderEntryFactory = lifecycleContextService.autoResponderEntryFactory;
        clientRequestFactory = lifecycleContextService.clientRequestFactory;
        autoResponderEntryDirectoryEntity = <AutoResponderEntryDirectoryEntity>autoResponderEntryFactory.create("Directory", Path.basename(__dirname), __dirname);
    });

    describe('getMatchResponder', () => {
        it('file exist', async () => {
            let url = `/${Path.basename(__dirname)}/${Path.basename(__filename)}`;
            let result = await autoResponderEntryDirectoryEntity.getMatchResponder(clientRequestFactory.create(url));
            expect(result.path).toBe(__filename);
        });

        it('file not exist', async () => {
            let url = `/${Path.basename(__dirname)}/not_exist.txt`;
            let result = await autoResponderEntryDirectoryEntity.getMatchResponder(clientRequestFactory.create(url));
            expect(result).toBeNull();
        });

        it('unmatch', async () => {
            let url = `/unknown-dir/${Path.basename(__filename)}`;
            let result = await autoResponderEntryDirectoryEntity.getMatchResponder(clientRequestFactory.create(url));
            expect(result).toBeNull();
        });
    });
});
