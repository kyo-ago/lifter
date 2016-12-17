import {AutoResponderEntryIdentity} from "./auto-responder-setting-file-identity";
import {AutoResponderEntryEntity} from "./auto-responder-setting-file-entity";

export class AutoResponderEntryFactory {
    private static identity = 0;

    static createFromFile(): AutoResponderEntryEntity {
        return new AutoResponderEntryEntity(
            new AutoResponderEntryIdentity(this.identity++),
        );
    }
}