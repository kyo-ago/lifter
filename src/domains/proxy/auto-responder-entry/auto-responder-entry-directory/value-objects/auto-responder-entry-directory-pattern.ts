import {ClientRequestEntity} from '../../../client-request/client-request-entity';
import {GetMatchPathCodeString} from "../../lib/get-match-path-code-string";
import {AutoResponderEntryPattern} from '../../value-objects/auto-responder-entry-pattern';

export class AutoResponderEntryDirectoryPattern extends AutoResponderEntryPattern {
    static createSafeValue(pattern: string) {
        return new AutoResponderEntryDirectoryPattern(pattern.replace(/[^\/]$/, '$&/'));
    }

    getMatchCodeString(proxyConnect: string): string {
        return GetMatchPathCodeString(proxyConnect, this.value);
    }

    isMatchPath(clientRequestEntity: ClientRequestEntity): boolean {
        let splitted = clientRequestEntity.pathname.split(this.value);

        // unmatch
        if (splitted.length === 1) return false;

        // is not last match?
        if (!splitted.pop()) return false;

        return true;
    }
}
