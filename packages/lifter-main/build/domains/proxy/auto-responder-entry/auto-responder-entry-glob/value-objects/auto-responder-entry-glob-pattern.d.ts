import { ClientRequestEntity } from "../../../client-request/client-request-entity";
import { AutoResponderEntryPattern } from "../../value-objects/auto-responder-entry-pattern";
export declare class AutoResponderEntryGlobPattern extends AutoResponderEntryPattern {
    private matchRegexp;
    constructor(pattern: string);
    getMatchCodeString(proxyConnect: string): string;
    isMatchPath(clientRequestEntity: ClientRequestEntity): boolean;
}
