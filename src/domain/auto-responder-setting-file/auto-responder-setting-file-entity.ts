import {Entity} from "typescript-dddbase";
import {AutoResponderSettingFileIdentity} from "./auto-responder-setting-file-identity";
import {AutoResponderSettingFilePath} from "./value-objects/auto-responder-setting-file-path";
import {AutoResponderEntryEntity} from "../auto-responder-entry/auto-responder-entry-entity";

export class AutoResponderSettingFileEntity extends Entity<AutoResponderSettingFileIdentity> {
    constructor(
        identity: AutoResponderSettingFileIdentity,
        private _path: AutoResponderSettingFilePath,
        private autoResponderEntries: AutoResponderEntryEntity[],
    ) {
        super(identity);
    }

    get id() {
        return this.getIdentity().getValue();
    }

    get path() {
        return this._path.value;
    }

}