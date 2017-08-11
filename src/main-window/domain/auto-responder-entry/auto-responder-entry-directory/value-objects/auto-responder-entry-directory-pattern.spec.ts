import {ClientRequestUrl} from "../../../client-request/value-objects/client-request-url";
import {AutoResponderEntryDirectoryPattern} from "./auto-responder-entry-directory-pattern";

describe('AutoResponderEntryDirectoryPattern', () => {
    describe('isMatchPath', () => {
        it('is root url is unmatch', () => {
            let autoResponderEntryDirectoryPattern = AutoResponderEntryDirectoryPattern.createSafeValue('/');
            expect(autoResponderEntryDirectoryPattern.isMatchPath(new ClientRequestUrl('/'))).toBe(false);
        });
        it('is directory url is unmatch', () => {
            let autoResponderEntryDirectoryPattern = AutoResponderEntryDirectoryPattern.createSafeValue('/hoge/');
            expect(autoResponderEntryDirectoryPattern.isMatchPath(new ClientRequestUrl('/hoge/'))).toBe(false);
        });
        it('is match', () => {
            let autoResponderEntryDirectoryPattern = AutoResponderEntryDirectoryPattern.createSafeValue('/hoge/');
            expect(autoResponderEntryDirectoryPattern.isMatchPath(new ClientRequestUrl('/hoge/huga'))).toBe(true);
        });
        it('is middle match', () => {
            let autoResponderEntryDirectoryPattern = AutoResponderEntryDirectoryPattern.createSafeValue('/hoge/');
            expect(autoResponderEntryDirectoryPattern.isMatchPath(new ClientRequestUrl('/foo/bar/hoge/huga/gege'))).toBe(true);
        });
    });
});
