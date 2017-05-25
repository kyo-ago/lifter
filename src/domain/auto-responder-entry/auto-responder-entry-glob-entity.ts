import * as fs from 'fs';
import * as mime from 'mime';
import {ClientRequestUrl} from '../client-request/value-objects/client-request-url';
import {LocalFileResponderEntity} from '../local-file-responder/local-file-responder-entity';
import {LocalFileResponderFactory} from '../local-file-responder/local-file-responder-factory';
import {LocalFileResponderPath} from '../local-file-responder/value-objects/local-file-responder-path';
import {LocalFileResponderSize} from '../local-file-responder/value-objects/local-file-responder-size';
import {LocalFileResponderType} from '../local-file-responder/value-objects/local-file-responder-type';
import {AutoResponderEntryEntity} from './auto-responder-entry-entity';

export class AutoResponderEntryGlobEntity extends AutoResponderEntryEntity {
    type: "Glob";

    getMatchResponder(path: ClientRequestUrl): Promise<LocalFileResponderEntity | null> {
        return this.getMatchStats(path).then((stats: fs.Stats | null) => {
            if (!stats) {
                return Promise.resolve(null);
            }
            return LocalFileResponderFactory.create(
                new LocalFileResponderPath(this.path.value),
                new LocalFileResponderType(mime.lookup(this.path.value)),
                new LocalFileResponderSize(stats.size),
            );
        });
    }
}
