import * as micromatch from "micromatch";
import * as Path from "path";
import { BaseValueObject } from "../../../base/value-objects/base-value-object";
import { ClientRequestEntity } from "../../client-request/client-request-entity";

export class AutoResponderPattern extends BaseValueObject<string> {
    private matchRegexp: RegExp;

    constructor(pattern: string) {
        super(pattern);

        this.matchRegexp = micromatch.makeRe(pattern);
    }

    getMatchCodeString(proxyConnect: string): string {
        // similar matchBase option
        let regexp = String(this.matchRegexp).replace(/^\/\^/, "/");

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
