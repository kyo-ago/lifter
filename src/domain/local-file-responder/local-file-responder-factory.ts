import {LocalFileResponderIdentity} from "./local-file-responder-identity";
import {LocalFileResponderEntity} from "./local-file-responder-entity";
import {LocalFileResponderSize} from "./value-objects/local-file-responder-size";
import {LocalFileResponderPath} from "./value-objects/local-file-responder-path";
import {LocalFileResponderType} from "./value-objects/local-file-responder-type";

export class LocalFileResponderFactory {
    private static identity = 0;

    static createResponder(
        path: LocalFileResponderPath,
        type: LocalFileResponderType,
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