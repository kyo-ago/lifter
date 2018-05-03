import * as micromatch from "micromatch";
import * as Path from "path";
import { ClientRequestEntity } from "../../../client-request/client-request-entity";
import { AutoResponderPattern } from "../../value-objects/auto-responder-pattern";

export class AutoResponderGlobPattern extends AutoResponderPattern {
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
        let pathSearch = clientRequestEntity.pathSearch;

        // similar matchBase option
        return (
            this.matchRegexp.test(pathSearch) ||
            this.matchRegexp.test(Path.basename(pathSearch))
        );
    }
}
