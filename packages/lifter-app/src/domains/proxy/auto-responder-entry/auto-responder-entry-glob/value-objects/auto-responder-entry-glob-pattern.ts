import * as micromatch from "micromatch";
import * as Path from "path";
import { ClientRequestEntity } from "../../../client-request/client-request-entity";
import { AutoResponderEntryPattern } from "../../value-objects/auto-responder-entry-pattern";

export class AutoResponderEntryGlobPattern extends AutoResponderEntryPattern {
    private matchRegexp: RegExp;

    constructor(pattern: string) {
        super(pattern);

        this.matchRegexp = micromatch.makeRe(pattern);
    }

    getMatchCodeString(proxyConnect: string): string {
        // similar matchBase option
        let regexp = String(this.matchRegexp)
            .replace(/^\/\^/, "/")
            .replace(/\$\/$/, "/");

        return `
            if ((${regexp}).test(url)) {
                return "${proxyConnect}";
            }
        `;
    }

    isMatchPath(clientRequestEntity: ClientRequestEntity): boolean {
        let href = clientRequestEntity.href;

        // similar matchBase option
        return this.matchRegexp.test(href) || this.matchRegexp.test(Path.basename(href));
    }
}
