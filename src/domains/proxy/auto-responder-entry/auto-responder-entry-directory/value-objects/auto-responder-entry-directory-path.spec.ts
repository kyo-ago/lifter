import * as Path from 'path';
import {getLifecycleContextService} from '../../../../../../tests/mocks/main-window/mocks';
import {ClientRequestFactory} from '../../../client-request/lifecycle/client-request-factory';
import {AutoResponderEntryDirectoryPath} from './auto-responder-entry-directory-path';

describe('AutoResponderEntryDirectoryPath', () => {
    describe('getAutoResponderEntryFilePath', () => {
        let clientRequestFactory: ClientRequestFactory;
        beforeEach(() => {
            clientRequestFactory = getLifecycleContextService().clientRequestFactory;
        });

        let dirname = Path.basename(__dirname);
        let filename = Path.basename(__filename);
        it('root url', () => {
            let autoResponderEntryDirectoryPath = new AutoResponderEntryDirectoryPath(__dirname);
            let url = `/${dirname}/${filename}`;
            let result = autoResponderEntryDirectoryPath.getAutoResponderEntryFilePath(clientRequestFactory.create(url));
            expect(result.value).toBe(__filename);
        });
        it('sub url', () => {
            let autoResponderEntryDirectoryPath = new AutoResponderEntryDirectoryPath(__dirname);
            let url = `/sub/${dirname}/${filename}`;
            let result = autoResponderEntryDirectoryPath.getAutoResponderEntryFilePath(clientRequestFactory.create(url));
            expect(result.value).toBe(__filename);
        });
        it('unknow file', () => {
            let autoResponderEntryDirectoryPath = new AutoResponderEntryDirectoryPath(__dirname);
            let file = `/sub/${dirname}/unknow.txt`;
            let result = autoResponderEntryDirectoryPath.getAutoResponderEntryFilePath(clientRequestFactory.create(file));
            expect(result.value).toBe(`${__dirname}/unknow.txt`);
        });
    });
});
