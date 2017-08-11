import * as Path from "path";
import {getLifecycleContextService} from "../../../../../test/main-window/mocks";
import {ClientRequestUrl} from "../../client-request/value-objects/client-request-url";
import {AutoResponderEntryFactory} from "../lifecycle/auto-responder-entry-factory";

describe('AutoResponderEntryFileEntity', () => {
    let autoResponderEntryFactory: AutoResponderEntryFactory;

    beforeEach(() => {
        autoResponderEntryFactory = getLifecycleContextService().autoResponderEntryFactory;
    });

    describe('getMatchResponder', () => {
        it('match filename', async () => {
            let filename = Path.basename(__filename);
            let autoResponderEntryDirectoryEntity = autoResponderEntryFactory.create("File", filename, __filename);
            let result = await autoResponderEntryDirectoryEntity.getMatchResponder(new ClientRequestUrl(`/hgoe/${filename}`));
            expect(result.path).toBe(__filename);
        });
        it('match url', async () => {
            let autoResponderEntryDirectoryEntity = autoResponderEntryFactory.create("File", 'a', __filename);
            let result = await autoResponderEntryDirectoryEntity.getMatchResponder(new ClientRequestUrl('/a'));
            expect(result.path).toBe(__filename);
        });
        it('unmatch', async () => {
            let autoResponderEntryDirectoryEntity = autoResponderEntryFactory.create("File", 'aaaa', __filename);
            let result = await autoResponderEntryDirectoryEntity.getMatchResponder(new ClientRequestUrl('/a'));
            expect(result).toBeNull();
        });
    });
});
