import {getLifecycleContextService} from "../../../../../../test/main-window/mocks";
import {ClientRequestFactory} from "../../../client-request/lifecycle/client-request-factory";
import {AutoResponderEntryFilePattern} from "./auto-responder-entry-file-pattern";

describe('AutoResponderEntryFilePattern', () => {
    describe('isMatchPath', () => {
        let clientRequestFactory: ClientRequestFactory;
        beforeEach(() => {
            clientRequestFactory = getLifecycleContextService().clientRequestFactory;
        });

        it('unmatch', () => {
            let autoResponderEntryFilePattern = new AutoResponderEntryFilePattern('hoge.txt');
            expect(autoResponderEntryFilePattern.isMatchPath(clientRequestFactory.create('/'))).toBe(false);
        });
        it('match', () => {
            let autoResponderEntryFilePattern = new AutoResponderEntryFilePattern('hoge.txt');
            expect(autoResponderEntryFilePattern.isMatchPath(clientRequestFactory.create('/hoge.txt'))).toBe(true);
        });
        it('directory', () => {
            let autoResponderEntryFilePattern = new AutoResponderEntryFilePattern('hoge.txt');
            expect(autoResponderEntryFilePattern.isMatchPath(clientRequestFactory.create('/huga/hoge.txt'))).toBe(true);
        });
        it('not file url', () => {
            let autoResponderEntryFilePattern = new AutoResponderEntryFilePattern('hoge.txt');
            expect(autoResponderEntryFilePattern.isMatchPath(clientRequestFactory.create('/huga/hoge.txt/foo/bar'))).toBe(false);
        });
    });
});
