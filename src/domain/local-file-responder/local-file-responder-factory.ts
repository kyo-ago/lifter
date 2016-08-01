import {LocalFileResponderIdentity} from "./local-file-responder-identity";
import {LocalFileResponderEntity} from "./local-file-responder-entity";
import {AutoResponderEntryType} from "../auto-responder-entry/auto-responder-entry-type";
import {AutoResponderEntryPath} from "../auto-responder-entry/auto-responder-entry-path";
import {LocalFileResponderSize} from "./local-file-responder-size";

export class LocalFileResponderFactory {
    private static identity = 0;

    static createResponder(
        path: AutoResponderEntryPath,
        type: AutoResponderEntryType,
        size: LocalFileResponderSize,
    ): LocalFileResponderEntity {
        return new LocalFileResponderEntity(
            new LocalFileResponderIdentity(this.identity++),
            path,
            type,
            size,
        );
    }
}