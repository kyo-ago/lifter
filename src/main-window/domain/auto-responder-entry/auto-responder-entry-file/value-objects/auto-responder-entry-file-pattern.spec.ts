import {AutoResponderEntryFilePattern} from "./auto-responder-entry-file-pattern";
import {ClientRequestUrl} from "../../../client-request/value-objects/client-request-url";

describe('AutoResponderEntryFilePattern', () => {
    describe('isMatchPath', () => {
        it('unmatch', () => {
            let autoResponderEntryFilePattern = new AutoResponderEntryFilePattern('hoge.txt');
            expect(autoResponderEntryFilePattern.isMatchPath(new ClientRequestUrl('/'))).toBe(false);
        });
        it('match', () => {
            let autoResponderEntryFilePattern = new AutoResponderEntryFilePattern('hoge.txt');
            expect(autoResponderEntryFilePattern.isMatchPath(new ClientRequestUrl('/hoge.txt'))).toBe(true);
        });
        it('directory', () => {
            let autoResponderEntryFilePattern = new AutoResponderEntryFilePattern('hoge.txt');
            expect(autoResponderEntryFilePattern.isMatchPath(new ClientRequestUrl('/huga/hoge.txt'))).toBe(true);
        });
        it('not file url', () => {
            let autoResponderEntryFilePattern = new AutoResponderEntryFilePattern('hoge.txt');
            expect(autoResponderEntryFilePattern.isMatchPath(new ClientRequestUrl('/huga/hoge.txt/foo/bar'))).toBe(false);
        });
    });
});
