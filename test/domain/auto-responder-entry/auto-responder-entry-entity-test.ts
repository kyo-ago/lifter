import 'mocha';
import {} from 'node';
const Path = require('path');
const assert = require('assert');
import {AutoResponderEntryEntity} from "../../../src/domain/auto-responder-entry/auto-responder-entry-entity";
import {AutoResponderEntryIdentity} from "../../../src/domain/auto-responder-entry/auto-responder-entry-identity";
import {AutoResponderEntryPattern} from "../../../src/domain/auto-responder-entry/auto-responder-entry-pattern";
import {AutoResponderEntryPath} from "../../../src/domain/auto-responder-entry/auto-responder-entry-path";
import {AutoResponderEntryType} from "../../../src/domain/auto-responder-entry/auto-responder-entry-type";
import {ClientRequestPathname} from "../../../src/domain/client-request/client-request-pathname";
import {LocalFileResponderEntity} from "../../../src/domain/local-file-responder/local-file-responder-entity";

describe('AutoResponderEntryEntity', () => {
    let absolutePath = Path.resolve(__dirname);
    let directoryAutoResponderEntryEntity = new AutoResponderEntryEntity(
        new AutoResponderEntryIdentity(1),
        new AutoResponderEntryPattern(Path.basename(absolutePath)),
        new AutoResponderEntryPath(absolutePath),
        new AutoResponderEntryType('')
    );
    it('match directoryAutoResponderEntryEntity.getMatchResponder', () => {
        let clientRequestPathname = new ClientRequestPathname(Path.resolve(__filename));
        return directoryAutoResponderEntryEntity.getMatchResponder(clientRequestPathname).then((resolve) => {
            assert(resolve instanceof LocalFileResponderEntity);
            assert(resolve.getContentType() === 'application/javascript');
            return resolve.getBody();
        }).then((body) => {
            assert(body.length !== 0);
        });
    });
    it('unmatch directoryAutoResponderEntryEntity.getMatchResponder', () => {
        let clientRequestPathname = new ClientRequestPathname(Path.resolve(__filename) + '/hoge');
        return directoryAutoResponderEntryEntity.getMatchResponder(clientRequestPathname).then((resolve) => {
            assert(resolve === null);
        });
    });
});