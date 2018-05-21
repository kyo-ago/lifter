import { ClientRequestEntity } from "../../client-request/client-request-entity";
import { GetFileMatchCodeString } from "../lib/get-match-path-code-string";
import { AutoResponderPattern } from "./auto-responder-pattern";

export class AutoResponderFilePattern extends AutoResponderPattern {
    static createSafeValue(text: string) {
        let pattern = text.replace(/^\/|\/$/g, "");
        return new AutoResponderFilePattern(`/${pattern}`);
    }

    getMatchCodeString(proxyConnect: string): string {
        return GetFileMatchCodeString(proxyConnect, this.value);
    }

    isMatchPath(clientRequestEntity: ClientRequestEntity): boolean {
        // missing pathname
        if (!clientRequestEntity.pathname) return false;

        let path = clientRequestEntity.pathname;
        return path.includes(this.value, path.length - this.value.length);
    }
}
