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
            let result = autoResponderEntryGlobPattern.isMatchPath(clientRequestFactory.create('/hoge'));
            expect(result).toBe(true);
        });
        it('directory match', () => {
            let autoResponderEntryGlobPattern = new AutoResponderEntryGlobPattern('/*/');
            let result = autoResponderEntryGlobPattern.isMatchPath(clientRequestFactory.create('/hoge/'));
            expect(result).toBe(true);
        });
        it('multi directory match', () => {
            let autoResponderEntryGlobPattern = new AutoResponderEntryGlobPattern('/**');
            let result = autoResponderEntryGlobPattern.isMatchPath(clientRequestFactory.create('/hoge/huga'));
            expect(result).toBe(true);
        });
        it('extension match', () => {
            let autoResponderEntryGlobPattern = new AutoResponderEntryGlobPattern('*.js');
            let result = autoResponderEntryGlobPattern.isMatchPath(clientRequestFactory.create('/hoge/huga.js'));
            expect(result).toBe(true);
        });
        it('unmatch', () => {
            let autoResponderEntryGlobPattern = new AutoResponderEntryGlobPattern('/hoge/*');
            let result = autoResponderEntryGlobPattern.isMatchPath(clientRequestFactory.create('/huga'));
            expect(result).toBe(false);
        });
    });
});
