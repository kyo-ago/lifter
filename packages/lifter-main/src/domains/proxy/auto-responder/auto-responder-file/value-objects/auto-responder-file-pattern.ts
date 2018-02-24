import { ClientRequestEntity } from "../../../client-request/client-request-entity";
import { GetMatchPathCodeString } from "../../lib/get-match-path-code-string";
import { AutoResponderPattern } from "../../value-objects/auto-responder-pattern";

export class AutoResponderFilePattern extends AutoResponderPattern {
    getMatchCodeString(proxyConnect: string): string {
        return GetMatchPathCodeString(proxyConnect, this.value);
    }

    isMatchPath(clientRequestEntity: ClientRequestEntity): boolean {
        // missing pathname
        if (!clientRequestEntity.pathname) return false;

        let splitted = clientRequestEntity.pathname.split(this.value);

        // unmatch
        if (splitted.length === 1) return false;

        // is last match?
        if (splitted.pop()) return false;

        return true;
    }
}
