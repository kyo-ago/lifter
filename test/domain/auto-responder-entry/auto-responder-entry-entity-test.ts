import 'mocha';
import * as Path from "path";
import * as assert from "assert";

import {AutoResponderEntryBaseEntity} from "../../../src/domain/auto-responder/entry/base/auto-responder-entry-base-entity";
import {AutoResponderEntryBaseIdentity} from "../../../src/domain/auto-responder/entry/base/auto-responder-entry-base-identity";
import {AutoResponderEntryBasePattern} from "../../../src/domain/auto-responder/entry/base/value-objects/auto-responder-entry-base-pattern";
import {AutoResponderEntryBasePath} from "../../../src/domain/auto-responder/entry/base/value-objects/auto-responder-entry-base-path";
import {ClientRequestUrl} from "../../../src/domain/client-request/value-objects/client-request-url";
import {LocalFileResponderEntity} from "../../../src/domain/local-file-responder/local-file-responder-entity";
import {AutoResponderEntryBaseType} from "../../../src/domain/auto-responder/entry/base/value-objects/auto-responder-entry-base-type";

describe('AutoResponderEntryBaseEntity', () => {
    let absoluteDirectoryPath = Path.resolve(__dirname);
    let directoryAutoResponderEntryEntity = new AutoResponderEntryBaseEntity(
        new AutoResponderEntryBaseIdentity(1),
        new AutoResponderEntryBasePattern(Path.basename(absoluteDirectoryPath)),
        new AutoResponderEntryBasePath(absoluteDirectoryPath),
        new AutoResponderEntryBaseType("Directory"),
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
    let fileAutoResponderEntryEntity = new AutoResponderEntryBaseEntity(
        new AutoResponderEntryBaseIdentity(1),
        new AutoResponderEntryBasePattern(Path.basename(absoluteFilePath)),
        new AutoResponderEntryBasePath(absoluteFilePath),
        new AutoResponderEntryBaseType("File"),
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