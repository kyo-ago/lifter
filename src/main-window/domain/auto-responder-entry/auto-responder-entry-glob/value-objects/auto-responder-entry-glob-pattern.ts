import * as micromatch from "micromatch";
import {ClientRequestUrl} from "../../../client-request/value-objects/client-request-url";
import {AutoResponderEntryPattern} from "../../value-objects/auto-responder-entry-pattern";

export class AutoResponderEntryGlobPattern extends AutoResponderEntryPattern {
    isMatchPath(clientRequestUrl: ClientRequestUrl): boolean {
        return micromatch.isMatch(clientRequestUrl.getPathname(), this.value, {
            matchBase: true,
        });
    }
}
