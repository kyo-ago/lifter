import {ClientRequestUrl} from "../../../client-request/value-objects/client-request-url";
import {AutoResponderEntryPattern} from "../../value-objects/auto-responder-entry-pattern";

export class AutoResponderEntryFilePattern extends AutoResponderEntryPattern {
    isMatchPath(clientRequestUrl: ClientRequestUrl): boolean {
        let splitted = clientRequestUrl.getPathname().split(this.value);

        // unmatch
        if (splitted.length === 1) return;

        // is last match?
        if (splitted.pop()) return;

        return true;
    }
}
