import * as Path from 'path';
import {getLifecycleContextService} from "../../../../../tests/mocks/main-window/get-lifecycle-context-service";
import {ClientRequestFactory} from '../../client-request/lifecycle/client-request-factory';
import {AutoResponderEntryFactory} from '../lifecycle/auto-responder-entry-factory';
import {AutoResponderEntryGlobEntity} from './auto-responder-entry-glob-entity';

describe('AutoResponderEntryGlobEntity.getMatchResponder', () => {
    let autoResponderEntryFactory: AutoResponderEntryFactory;
    let clientRequestFactory: ClientRequestFactory;
    beforeEach(async () => {
        let lifecycleContextService = await getLifecycleContextService();
        autoResponderEntryFactory = lifecycleContextService.autoResponderEntryFactory;
        clientRequestFactory = lifecycleContextService.clientRequestFactory;
    });
    let createAutoResponderEntryGlobEntity = (pattern: string, path: string): AutoResponderEntryGlobEntity => {
        return <AutoResponderEntryGlobEntity>autoResponderEntryFactory.create("Glob", pattern, path)
    };

    it('file path', async () => {
        let autoResponderEntryGlobEntity = createAutoResponderEntryGlobEntity('/*', __filename);
        let clientRequestEntity = clientRequestFactory.create('/hoge');
        let result = await autoResponderEntryGlobEntity.getMatchResponder(clientRequestEntity);
        expect(result.path).toBe(__filename);
    });

    it('directory path', async () => {
        let filename = Path.basename(__filename);
        let autoResponderEntryGlobEntity = createAutoResponderEntryGlobEntity('/*', __dirname);
        let clientRequestEntity = clientRequestFactory.create(`/${filename}`);
        let result = await autoResponderEntryGlobEntity.getMatchResponder(clientRequestEntity);
        expect(result.path).toBe(__filename);
    });
});
