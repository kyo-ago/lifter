import * as Path from "path";
import {ClientRequestUrl} from "../../../client-request/value-objects/client-request-url";
import {AutoResponderEntryDirectoryPattern} from "./auto-responder-entry-directory-pattern";
import {AutoResponderEntryDirectoryPath} from "./auto-responder-entry-directory-path";

describe('AutoResponderEntryDirectoryPath', () => {
    describe('getAutoResponderEntryFilePath', () => {
        it('root url', () => {
            let autoResponderEntryDirectoryPath = new AutoResponderEntryDirectoryPath(__dirname);
            let url = `/${Path.join(__dirname, Path.basename(__filename))}`;
            let result = autoResponderEntryDirectoryPath.getAutoResponderEntryFilePath(new ClientRequestUrl(url));
            expect(result.value).toBe(__filename);
        });
        it('sub url', () => {
            let autoResponderEntryDirectoryPath = new AutoResponderEntryDirectoryPath(__dirname);
            let url = `/sub/${Path.join(__dirname, Path.basename(__filename))}`;
            let result = autoResponderEntryDirectoryPath.getAutoResponderEntryFilePath(new ClientRequestUrl(url));
            expect(result.value).toBe(__filename);
        });
        it('unknow file', () => {
            let autoResponderEntryDirectoryPath = new AutoResponderEntryDirectoryPath(__dirname);
            let file = Path.join(__dirname, 'unknow.txt');
            let result = autoResponderEntryDirectoryPath.getAutoResponderEntryFilePath(new ClientRequestUrl(`/sub/${file}`));
            expect(result.value).toBe(`${__dirname}/unknow.txt`);
        });
    });
});
