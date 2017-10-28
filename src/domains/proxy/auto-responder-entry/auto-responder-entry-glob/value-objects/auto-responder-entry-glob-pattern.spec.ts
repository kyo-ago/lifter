import {getLifecycleContextService} from "../../../../../../tests/mocks/main-window/get-lifecycle-context-service";
import {ClientRequestFactory} from '../../../client-request/lifecycle/client-request-factory';
import {AutoResponderEntryGlobPattern} from './auto-responder-entry-glob-pattern';

describe('AutoResponderEntryGlobPattern', () => {
    describe('isMatchPath', () => {
        let clientRequestFactory: ClientRequestFactory;
        beforeEach(async () => {
            clientRequestFactory = (await getLifecycleContextService()).clientRequestFactory;
        });

        it('match', () => {
            let autoResponderEntryGlobPattern = new AutoResponderEntryGlobPattern('/*');
            let clientRequestEntity = clientRequestFactory.createFromString('/hoge');
            let result = autoResponderEntryGlobPattern.isMatchPath(clientRequestEntity);
            expect(result).toBe(true);
        });
        it('directory match', () => {
            let autoResponderEntryGlobPattern = new AutoResponderEntryGlobPattern('/*/');
            let clientRequestEntity = clientRequestFactory.createFromString('/hoge/');
            let result = autoResponderEntryGlobPattern.isMatchPath(clientRequestEntity);
            expect(result).toBe(true);
        });
        it('multi directory match', () => {
            let autoResponderEntryGlobPattern = new AutoResponderEntryGlobPattern('/**');
            let clientRequestEntity = clientRequestFactory.createFromString('/hoge/huga');
            let result = autoResponderEntryGlobPattern.isMatchPath(clientRequestEntity);
            expect(result).toBe(true);
        });
        it('extension match', () => {
            let autoResponderEntryGlobPattern = new AutoResponderEntryGlobPattern('*.js');
            let clientRequestEntity = clientRequestFactory.createFromString('/hoge/huga.js');
            let result = autoResponderEntryGlobPattern.isMatchPath(clientRequestEntity);
            expect(result).toBe(true);
        });
        it('unmatch', () => {
            let autoResponderEntryGlobPattern = new AutoResponderEntryGlobPattern('/hoge/*');
            let clientRequestEntity = clientRequestFactory.createFromString('/huga');
            let result = autoResponderEntryGlobPattern.isMatchPath(clientRequestEntity);
            expect(result).toBe(false);
        });
    });
});
