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
            let clientRequestEntity = clientRequestFactory.createFromString('/');
            expect(autoResponderEntryDirectoryPattern.isMatchPath(clientRequestEntity)).toBe(false);
        });
        it('is directory url is unmatch', () => {
            let autoResponderEntryDirectoryPattern = AutoResponderEntryDirectoryPattern.createSafeValue('/hoge/');
            let clientRequestEntity = clientRequestFactory.createFromString('/hoge/');
            expect(autoResponderEntryDirectoryPattern.isMatchPath(clientRequestEntity)).toBe(false);
        });
        it('is match', () => {
            let autoResponderEntryDirectoryPattern = AutoResponderEntryDirectoryPattern.createSafeValue('/hoge/');
            let clientRequestEntity = clientRequestFactory.createFromString('/hoge/huga');
            expect(autoResponderEntryDirectoryPattern.isMatchPath(clientRequestEntity)).toBe(true);
        });
        it('is middle match', () => {
            let autoResponderEntryDirectoryPattern = AutoResponderEntryDirectoryPattern.createSafeValue('/hoge/');
            let clientRequestEntity = clientRequestFactory.createFromString('/foo/bar/hoge/huga/gege');
            expect(autoResponderEntryDirectoryPattern.isMatchPath(clientRequestEntity)).toBe(true);
        });
    });
});
