
import {AutoResponderEntryFactory} from "../lifecycle/auto-responder-entry-factory";
import {getLifecycleContextService} from "../../../../../test/main-window/mocks";
import {ClientRequestUrl} from "../../client-request/value-objects/client-request-url";
describe('AutoResponderEntryDirectoryEntity', () => {
    let autoResponderEntryFactory: AutoResponderEntryFactory;

    beforeEach(() => {
        let lifecycleContextService = getLifecycleContextService();
        autoResponderEntryFactory = lifecycleContextService.autoResponderEntryFactory;
    });

    describe('getMatchResponder', () => {
        it('is unmatch url is returned null', async () => {
            let autoResponderEntryDirectoryEntity = autoResponderEntryFactory.create("Directory", 'a', __dirname);
            let result = await autoResponderEntryDirectoryEntity.getMatchResponder(new ClientRequestUrl('/b'));
            expect(result).toBeNull();
        });
        it('is match url is returned param', async () => {
            let autoResponderEntryDirectoryEntity = autoResponderEntryFactory.create("Directory", 'a', __dirname);
            let result = await autoResponderEntryDirectoryEntity.getMatchResponder(new ClientRequestUrl('/a'));
            expect(result).not.toBeNull();
        });
        it('is match partial url is returned param', async () => {
            let autoResponderEntryDirectoryEntity = autoResponderEntryFactory.create("Directory", 'aaaa', __dirname);
            let result = await autoResponderEntryDirectoryEntity.getMatchResponder(new ClientRequestUrl('/a'));
            expect(result).not.toBeNull();
        });
    });
});
