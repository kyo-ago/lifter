import {getLifecycleContextService} from "../../../../../tests/mocks/main-window/get-lifecycle-context-service";
import {ClientRequestFactory} from '../../client-request/lifecycle/client-request-factory';
import {AutoResponderEntryFactory} from './auto-responder-entry-factory';
import {AutoResponderEntryRepository} from './auto-responder-entry-repositoty';

describe('AutoResponderEntryRepository', () => {
    let autoResponderEntryRepository: AutoResponderEntryRepository;
    let autoResponderEntryFactory: AutoResponderEntryFactory;
    let clientRequestFactory: ClientRequestFactory;

    beforeEach(async () => {
        let lifecycleContextService = await getLifecycleContextService();
        autoResponderEntryRepository = lifecycleContextService.autoResponderEntryRepository;
        autoResponderEntryFactory = lifecycleContextService.autoResponderEntryFactory;
        clientRequestFactory = lifecycleContextService.clientRequestFactory;
    });

    describe('findMatchEntry', () => {
        it('result is null', async () => {
            let result = await autoResponderEntryRepository.findMatchEntry(clientRequestFactory.create(''));
            expect(result).toBeNull();
        });
        it('result is not null', async () => {
            await autoResponderEntryRepository.store(autoResponderEntryFactory.create("File", 'a', __filename));
            let result = await autoResponderEntryRepository.findMatchEntry(clientRequestFactory.create('/a'));
            expect(result).not.toBeNull();
        });
        it('choose from entities', async () => {
            let entities = Array.from(Array(10)).map((_, index) => autoResponderEntryFactory.create("File", String(index), __filename));
            await autoResponderEntryRepository.storeList(entities);
            let result = await autoResponderEntryRepository.findMatchEntry(clientRequestFactory.create('/2'));
            expect(result).not.toBeNull();
        });
    });
});
