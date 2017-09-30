import {getLifecycleContextService} from "../../../../../../tests/mocks/main-window/get-lifecycle-context-service";
import {ClientRequestFactory} from '../../../client-request/lifecycle/client-request-factory';
import {AutoResponderEntryDirectoryPattern} from './auto-responder-entry-directory-pattern';

describe('AutoResponderEntryDirectoryPattern', () => {
    describe('isMatchPath', () => {
        let clientRequestFactory: ClientRequestFactory;
        beforeEach(async () => {
            clientRequestFactory = (await getLifecycleContextService()).clientRequestFactory;
        });

        it('is root url is unmatch', () => {
            let autoResponderEntryDirectoryPattern = AutoResponderEntryDirectoryPattern.createSafeValue('/');
            expect(autoResponderEntryDirectoryPattern.isMatchPath(clientRequestFactory.create('/'))).toBe(false);
        });
        it('is directory url is unmatch', () => {
            let autoResponderEntryDirectoryPattern = AutoResponderEntryDirectoryPattern.createSafeValue('/hoge/');
            expect(autoResponderEntryDirectoryPattern.isMatchPath(clientRequestFactory.create('/hoge/'))).toBe(false);
        });
        it('is match', () => {
            let autoResponderEntryDirectoryPattern = AutoResponderEntryDirectoryPattern.createSafeValue('/hoge/');
            expect(autoResponderEntryDirectoryPattern.isMatchPath(clientRequestFactory.create('/hoge/huga'))).toBe(true);
        });
        it('is middle match', () => {
            let autoResponderEntryDirectoryPattern = AutoResponderEntryDirectoryPattern.createSafeValue('/hoge/');
            expect(autoResponderEntryDirectoryPattern.isMatchPath(clientRequestFactory.create('/foo/bar/hoge/huga/gege'))).toBe(true);
        });
    });
});
