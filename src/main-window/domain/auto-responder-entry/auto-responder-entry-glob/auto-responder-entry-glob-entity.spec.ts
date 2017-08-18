import * as Path from "path";
import {getLifecycleContextService} from "../../../../../test/main-window/mocks";
import {ClientRequestUrl} from "../../client-request/value-objects/client-request-url";
import {AutoResponderEntryGlobEntity} from "./auto-responder-entry-glob-entity";

let createAutoResponderEntryGlobEntity = (pattern: string, path: string) => {
    let autoResponderEntryFactory = getLifecycleContextService().autoResponderEntryFactory;
    return <AutoResponderEntryGlobEntity>autoResponderEntryFactory.create("Glob", pattern, path);
};

describe('AutoResponderEntryGlobEntity.getMatchResponder', () => {
    it('file path', async () => {
        let autoResponderEntryGlobEntity = createAutoResponderEntryGlobEntity('/*', __filename);
        let result = await autoResponderEntryGlobEntity.getMatchResponder(new ClientRequestUrl('/hoge'));
        expect(result.path).toBe(__filename);
    });

    it('directory path', async () => {
        let autoResponderEntryGlobEntity = createAutoResponderEntryGlobEntity('/*', __dirname);
        let filename = Path.basename(__filename);
        let result = await autoResponderEntryGlobEntity.getMatchResponder(new ClientRequestUrl(`/${filename}`));
        expect(result.path).toBe(__filename);
    });
});
