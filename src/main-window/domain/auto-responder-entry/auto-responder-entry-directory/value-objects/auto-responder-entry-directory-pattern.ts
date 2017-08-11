import {ClientRequestUrl} from "../../../client-request/value-objects/client-request-url";
import {AutoResponderEntryPattern} from "../../value-objects/auto-responder-entry-pattern";

export class AutoResponderEntryDirectoryPattern extends AutoResponderEntryPattern {
    static createSafeValue(pattern: string) {
        return new AutoResponderEntryDirectoryPattern(pattern.replace(/[^\/]$/, '$&/'));
    }

    isMatchPath(clientRequestUrl: ClientRequestUrl): boolean {
        let splitted = clientRequestUrl.getPathname().split(this.value);

        // unmatch
        if (splitted.length === 1) return;

        // is not last match?
        if (!splitted.pop()) return;

        return true;
    }
}
