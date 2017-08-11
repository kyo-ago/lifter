
import {AutoResponderEntryFactory} from "../lifecycle/auto-responder-entry-factory";
import {getLifecycleContextService} from "../../../../../test/main-window/mocks";
import {ClientRequestUrl} from "../../client-request/value-objects/client-request-url";
describe('AutoResponderEntryFileEntity', () => {
    let autoResponderEntryFactory: AutoResponderEntryFactory;

    beforeEach(() => {
        autoResponderEntryFactory = getLifecycleContextService().autoResponderEntryFactory;
    });

    describe('getMatchResponder', () => {
        it('is unmatch url is returned null', async () => {
            let autoResponderEntryDirectoryEntity = autoResponderEntryFactory.create("File", 'a', __dirname);
            let result = await autoResponderEntryDirectoryEntity.getMatchResponder(new ClientRequestUrl('/b'));
            expect(result).toBeNull();
        });
        it('is match url is returned param', async () => {
            let autoResponderEntryDirectoryEntity = autoResponderEntryFactory.create("File", 'a', __dirname);
            let result = await autoResponderEntryDirectoryEntity.getMatchResponder(new ClientRequestUrl('/a'));
            expect(result).not.toBeNull();
        });
        it('is match partial url is returned param', async () => {
            let autoResponderEntryDirectoryEntity = autoResponderEntryFactory.create("File", 'aaaa', __dirname);
            let result = await autoResponderEntryDirectoryEntity.getMatchResponder(new ClientRequestUrl('/a'));
            expect(result).not.toBeNull();
        });
    });
});
