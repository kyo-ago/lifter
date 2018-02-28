import { ClientRequestEntity } from "../../../client-request/client-request-entity";
import { GetDirectoryMatchCodeString } from "../../lib/get-match-path-code-string";
import { AutoResponderPattern } from "../../value-objects/auto-responder-pattern";

export class AutoResponderDirectoryPattern extends AutoResponderPattern {
    static createSafeValue(text: string) {
        let pattern = text.replace(/^\/|\/$/g, "");
        return new AutoResponderDirectoryPattern(`/${pattern}/`);
    }

    getMatchCodeString(proxyConnect: string): string {
        return GetDirectoryMatchCodeString(proxyConnect, this.value);
    }

    isMatchPath(clientRequestEntity: ClientRequestEntity): boolean {
        let splitted = clientRequestEntity.pathname.split(this.value);

        // unmatch
        if (splitted.length === 1) return false;

        // is not last match?
        if (!splitted.pop()) return false;

        return true;
    }
}
