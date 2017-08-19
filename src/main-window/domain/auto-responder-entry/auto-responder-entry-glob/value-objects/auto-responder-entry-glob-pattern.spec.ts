import {ClientRequestUrl} from "../../../client-request/value-objects/client-request-url";
import {AutoResponderEntryGlobPattern} from "./auto-responder-entry-glob-pattern";

describe('AutoResponderEntryGlobPattern', () => {
    describe('isMatchPath', () => {
        it('match', () => {
            let autoResponderEntryGlobPattern = new AutoResponderEntryGlobPattern('/*');
            let result = autoResponderEntryGlobPattern.isMatchPath(new ClientRequestUrl('/hoge'));
            expect(result).toBe(true);
        });
        it('directory match', () => {
            let autoResponderEntryGlobPattern = new AutoResponderEntryGlobPattern('/*/');
            let result = autoResponderEntryGlobPattern.isMatchPath(new ClientRequestUrl('/hoge/'));
            expect(result).toBe(true);
        });
        it('multi directory match', () => {
            let autoResponderEntryGlobPattern = new AutoResponderEntryGlobPattern('/**');
            let result = autoResponderEntryGlobPattern.isMatchPath(new ClientRequestUrl('/hoge/huga'));
            expect(result).toBe(true);
        });
        it('extension match', () => {
            let autoResponderEntryGlobPattern = new AutoResponderEntryGlobPattern('*.js');
            let result = autoResponderEntryGlobPattern.isMatchPath(new ClientRequestUrl('/hoge/huga.js'));
            expect(result).toBe(true);
        });
        it('unmatch', () => {
            let autoResponderEntryGlobPattern = new AutoResponderEntryGlobPattern('/hoge/*');
            let result = autoResponderEntryGlobPattern.isMatchPath(new ClientRequestUrl('/huga'));
            expect(result).toBe(false);
        });
    });
});
