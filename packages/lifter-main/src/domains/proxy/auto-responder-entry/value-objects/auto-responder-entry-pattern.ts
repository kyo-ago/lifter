import {BaseValueObject} from "../../../base/value-objects/base-value-object";
import { ClientRequestEntity } from "../../client-request/client-request-entity";

export abstract class AutoResponderEntryPattern extends BaseValueObject<string> {
    abstract getMatchCodeString(proxyConnect: string): string;
    abstract isMatchPath(clientRequestEntity: ClientRequestEntity): boolean;
}
