import {Entity} from "typescript-dddbase";
import {LocalFileResponderIdentity} from "./local-file-responder-identity";

export class LocalFileResponderEntity extends Entity<LocalFileResponderIdentity> {
    constructor(
        identity: LocalFileResponderIdentity,
    ) {
        super(identity);
    }
}