import * as Path from "path";
import {getLifecycleContextService} from "../../../../../test/main-window/mocks";
import {ClientRequestFactory} from "../../client-request/lifecycle/client-request-factory";
import {AutoResponderEntryFactory} from "../lifecycle/auto-responder-entry-factory";

describe('AutoResponderEntryFileEntity', () => {
    let autoResponderEntryFactory: AutoResponderEntryFactory;
    let clientRequestFactory: ClientRequestFactory;

    beforeEach(() => {
        let lifecycleContextService = getLifecycleContextService();
        autoResponderEntryFactory = lifecycleContextService.autoResponderEntryFactory;
        clientRequestFactory = lifecycleContextService.clientRequestFactory;
    });

    describe('getMatchResponder', () => {
        it('match filename', async () => {
            let filename = Path.basename(__filename);
            let autoResponderEntryDirectoryEntity = autoResponderEntryFactory.create("File", filename, __filename);
            let result = await autoResponderEntryDirectoryEntity.getMatchResponder(clientRequestFactory.create(`/hgoe/${filename}`));
            expect(result.path).toBe(__filename);
        });
        it('match url', async () => {
            let autoResponderEntryDirectoryEntity = autoResponderEntryFactory.create("File", 'a', __filename);
            let result = await autoResponderEntryDirectoryEntity.getMatchResponder(clientRequestFactory.create('/a'));
            expect(result.path).toBe(__filename);
        });
        it('unmatch', async () => {
            let autoResponderEntryDirectoryEntity = autoResponderEntryFactory.create("File", 'aaaa', __filename);
            let result = await autoResponderEntryDirectoryEntity.getMatchResponder(clientRequestFactory.create('/a'));
            expect(result).toBeNull();
        });
    });
});
