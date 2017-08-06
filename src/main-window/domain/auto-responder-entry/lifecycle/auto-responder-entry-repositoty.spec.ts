import {getLifecycleContextService} from "../../../../../test/main-window/mocks";
import {ClientRequestUrl} from "../../client-request/value-objects/client-request-url";
import {AutoResponderEntryRepository} from "./auto-responder-entry-repositoty";

describe('AutoResponderEntryRepository', () => {
    let autoResponderEntryRepository: AutoResponderEntryRepository;
    beforeEach(() => {
        let lifecycleContextService = getLifecycleContextService();
        autoResponderEntryRepository = lifecycleContextService.autoResponderEntryRepository;
    });
    it('findMatchEntry', async () => {
        let result = await autoResponderEntryRepository.findMatchEntry(new ClientRequestUrl(''));
        expect(result).resolves.toBeNull();
    });
});
