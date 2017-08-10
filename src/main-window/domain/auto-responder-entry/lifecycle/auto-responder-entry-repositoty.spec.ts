import {getLifecycleContextService} from "../../../../../test/main-window/mocks";
import {ClientRequestUrl} from "../../client-request/value-objects/client-request-url";
import {AutoResponderEntryRepository} from "./auto-responder-entry-repositoty";
import {AutoResponderEntryFactory} from './auto-responder-entry-factory';

describe('AutoResponderEntryRepository', () => {
    let autoResponderEntryRepository: AutoResponderEntryRepository;
    let autoResponderEntryFactory: AutoResponderEntryFactory;

    beforeEach(() => {
        let lifecycleContextService = getLifecycleContextService();
        autoResponderEntryRepository = lifecycleContextService.autoResponderEntryRepository;
        autoResponderEntryFactory = lifecycleContextService.autoResponderEntryFactory;
    });

    describe('findMatchEntry', () => {
        it('result is null', async () => {
            let result = await autoResponderEntryRepository.findMatchEntry(new ClientRequestUrl(''));
            expect(result).toBeNull();
        });
        it('result is not null', async () => {
            autoResponderEntryRepository.store(autoResponderEntryFactory.create("File", 'a', __filename));
            let result = await autoResponderEntryRepository.findMatchEntry(new ClientRequestUrl('/a'));
            expect(result).not.toBeNull();
        });
    });
});
