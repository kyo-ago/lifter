import 'mocha';
import {} from 'node';
const Path = require('path');
const assert = require('assert');
import {AutoResponderEntryEntity} from "../../../src/domain/auto-responder-entry/auto-responder-entry-entity";
import {AutoResponderEntryIdentity} from "../../../src/domain/auto-responder-entry/auto-responder-entry-identity";
import {AutoResponderEntryPattern} from "../../../src/domain/auto-responder-entry/value-objects/auto-responder-entry-pattern";
import {AutoResponderEntryPath} from "../../../src/domain/auto-responder-entry/value-objects/auto-responder-entry-path";
import {AutoResponderEntryType} from "../../../src/domain/auto-responder-entry/value-objects/auto-responder-entry-type";
import {ClientRequestUrl} from "../../../src/domain/client-request/value-objects/client-request-url";
import {LocalFileResponderEntity} from "../../../src/domain/local-file-responder/local-file-responder-entity";

describe('AutoResponderEntryEntity', () => {
    let absoluteDirectoryPath = Path.resolve(__dirname);
    let directoryAutoResponderEntryEntity = new AutoResponderEntryEntity(
        new AutoResponderEntryIdentity(1),
        new AutoResponderEntryPattern(Path.basename(absoluteDirectoryPath)),
        new AutoResponderEntryPath(absoluteDirectoryPath),
        new AutoResponderEntryType(''),
    );
    it('match directoryAutoResponderEntryEntity.getMatchResponder', () => {
        let clientRequestPathname = new ClientRequestUrl(Path.resolve(__filename));
        return directoryAutoResponderEntryEntity.getMatchResponder(clientRequestPathname).then((resolve) => {
            assert(resolve instanceof LocalFileResponderEntity);
            assert(resolve.getHeader()['content-type'] === 'application/javascript');
            assert(resolve.getHeader()['content-length'] !== 0);
            return resolve.getBody();
        }).then((body) => {
            assert(body.length !== 0);
        });
    });
    it('unmatch directoryAutoResponderEntryEntity.getMatchResponder', () => {
        let clientRequestPathname = new ClientRequestUrl(Path.resolve(__dirname) + '/hoge');
        return directoryAutoResponderEntryEntity.getMatchResponder(clientRequestPathname).then((resolve) => {
            assert(resolve === null);
        });
    });

    let absoluteFilePath = Path.resolve(__filename);
    let fileAutoResponderEntryEntity = new AutoResponderEntryEntity(
        new AutoResponderEntryIdentity(1),
        new AutoResponderEntryPattern(Path.basename(absoluteFilePath)),
        new AutoResponderEntryPath(absoluteFilePath),
        new AutoResponderEntryType('application/javascript'),
    );
    it('match fileAutoResponderEntryEntity.getMatchResponder', () => {
        let clientRequestPathname = new ClientRequestUrl(Path.resolve(__filename));
        return fileAutoResponderEntryEntity.getMatchResponder(clientRequestPathname).then((resolve) => {
            assert(resolve instanceof LocalFileResponderEntity);
            assert(resolve.getHeader()['content-type'] === 'application/javascript');
            assert(resolve.getHeader()['content-length'] !== 0);
            return resolve.getBody();
        }).then((body) => {
            assert(body.length !== 0);
        });
    });
    it('unmatch fileAutoResponderEntryEntity.getMatchResponder', () => {
        let clientRequestPathname = new ClientRequestUrl(Path.resolve(__dirname) + '/hoge');
        return fileAutoResponderEntryEntity.getMatchResponder(clientRequestPathname).then((resolve) => {
            assert(resolve === null);
        });
    });
});