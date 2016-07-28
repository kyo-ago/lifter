import {LocalFileResponderIdentity} from "./local-file-responder-identity";
import {LocalFileResponderEntity} from "./local-file-responder-entity";

export class LocalFileResponderFactory {
    private static identity = 0;

    static createFile(): LocalFileResponderEntity {
        return new LocalFileResponderEntity(
            new LocalFileResponderIdentity(this.identity++),
        );
    }
}