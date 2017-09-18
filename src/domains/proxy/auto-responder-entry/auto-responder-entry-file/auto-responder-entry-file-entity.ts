import {ClientRequestEntity} from '../../client-request/client-request-entity';
import {LocalFileResponderParam} from '../../local-file-responder/lifecycle/local-file-responder-factory';
import {AutoResponderEntryEntity} from '../auto-responder-entry-entity';
import {AutoResponderEntryFilePath} from './value-objects/auto-responder-entry-file-path';
import {AutoResponderEntryFilePattern} from './value-objects/auto-responder-entry-file-pattern';

export class AutoResponderEntryFileEntity extends AutoResponderEntryEntity<AutoResponderEntryFilePattern, AutoResponderEntryFilePath> {
    getMatchResponder(clientRequestEntity: ClientRequestEntity): Promise<LocalFileResponderParam | null> {
        if (!this.pattern.isMatchPath(clientRequestEntity)) return null;

        return this.filePathToLocalFileResponderParam(this.path);
    }
}
