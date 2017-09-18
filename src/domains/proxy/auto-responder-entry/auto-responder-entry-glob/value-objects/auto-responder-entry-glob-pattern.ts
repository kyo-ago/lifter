import * as micromatch from 'micromatch';
import {ClientRequestEntity} from '../../../client-request/client-request-entity';
import {AutoResponderEntryPattern} from '../../value-objects/auto-responder-entry-pattern';

export class AutoResponderEntryGlobPattern extends AutoResponderEntryPattern {
    isMatchPath(clientRequestEntity: ClientRequestEntity): boolean {
        return micromatch.isMatch(clientRequestEntity.url, this.value, {
            matchBase: true,
        });
    }
}
