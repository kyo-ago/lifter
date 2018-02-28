import { ClientRequestEntity } from "../../../client-request/client-request-entity";
import { GetFileMatchCodeString } from "../../lib/get-match-path-code-string";
import { AutoResponderPattern } from "../../value-objects/auto-responder-pattern";

export class AutoResponderFilePattern extends AutoResponderPattern {
    getMatchCodeString(proxyConnect: string): string {
        return GetFileMatchCodeString(proxyConnect, `/${this.value}`);
    }

    isMatchPath(clientRequestEntity: ClientRequestEntity): boolean {
        // missing pathname
        if (!clientRequestEntity.pathname) return false;

        let path = clientRequestEntity.pathname;
        return path.includes(this.value, path.length - this.value.length);
    }
}
