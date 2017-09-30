import * as Path from 'path';
import {getLifecycleContextService} from '../../../../../../tests/mocks/main-window/get-lifecycle-context-service';
import {ClientRequestFactory} from '../../../client-request/lifecycle/client-request-factory';
import {AutoResponderEntryAnyPath} from './auto-responder-entry-any-path';

describe('AutoResponderEntryAnyPath', () => {
    describe('getAutoResponderEntryFilePath', () => {
        let dirname = Path.basename(__dirname);
        let filename = Path.basename(__filename);

        let clientRequestFactory: ClientRequestFactory;
        beforeEach(async () => {
            clientRequestFactory = (await getLifecycleContextService()).clientRequestFactory;
        });

        it('match file', async () => {
            let autoResponderEntryAnyPath = new AutoResponderEntryAnyPath(__filename);
            let url = `/${dirname}/${filename}`;
            let result = await autoResponderEntryAnyPath.getAutoResponderEntryFilePath(clientRequestFactory.create(url));
            expect(result.value).toBe(__filename);
        });
        it('match unknown file', async () => {
            let autoResponderEntryAnyPath = new AutoResponderEntryAnyPath(__filename);
            let url = `/${dirname}/hoge.txt`;
            let result = await autoResponderEntryAnyPath.getAutoResponderEntryFilePath(clientRequestFactory.create(url));
            expect(result.value).toBe(__filename);
        });
        it('match directory', async () => {
            let autoResponderEntryAnyPath = new AutoResponderEntryAnyPath(__dirname);
            let url = `/${dirname}/${filename}`;
            let result = await autoResponderEntryAnyPath.getAutoResponderEntryFilePath(clientRequestFactory.create(url));
            expect(result.value).toBe(__filename);
        });
        it('match root directory', async () => {
            let autoResponderEntryAnyPath = new AutoResponderEntryAnyPath(__dirname);
            let url = `/${filename}`;
            let result = await autoResponderEntryAnyPath.getAutoResponderEntryFilePath(clientRequestFactory.create(url));
            expect(result.value).toBe(__filename);
        });
        it('unmatch directory', async () => {
            let autoResponderEntryAnyPath = new AutoResponderEntryAnyPath(__dirname);
            let url = `/hoge/${filename}`;
            let result = await autoResponderEntryAnyPath.getAutoResponderEntryFilePath(clientRequestFactory.create(url));
            expect(result).toBeNull();
        });
    });
});
