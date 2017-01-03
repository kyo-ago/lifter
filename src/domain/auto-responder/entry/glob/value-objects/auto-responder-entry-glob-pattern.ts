import * as minimatch from "minimatch";

import {ClientRequestUrl} from "../../../../client-request/value-objects/client-request-url";
import {AutoResponderEntryBasePattern} from "../../base/value-objects/auto-responder-entry-base-pattern";

export class AutoResponderEntryGlobPattern extends AutoResponderEntryBasePattern {
    isMatch(path: ClientRequestUrl) {
        return minimatch(path.getPathname(), this._value);
    }
}