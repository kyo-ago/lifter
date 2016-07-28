import {LocalFileResponderIdentity} from "./local-file-responder-identity";
import {LocalFileResponderEntity} from "./local-file-responder-entity";
import {AutoResponderEntryType} from "../auto-responder-entry/auto-responder-entry-type";
import {AutoResponderEntryPath} from "../auto-responder-entry/auto-responder-entry-path";

export class LocalFileResponderFactory {
    private static identity = 0;

    static createResponder(
        path: AutoResponderEntryPath,
        type: AutoResponderEntryType,
    ): LocalFileResponderEntity {
        return new LocalFileResponderEntity(
            new LocalFileResponderIdentity(this.identity++),
            path,
            type,
        );
    }
}