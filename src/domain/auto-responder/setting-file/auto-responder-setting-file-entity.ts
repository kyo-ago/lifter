import {Entity} from "typescript-dddbase";
import {AutoResponderSettingFileIdentity} from "./auto-responder-setting-file-identity";
import {AutoResponderSettingFilePath} from "./value-objects/auto-responder-setting-file-path";
import {AutoResponderEntryBaseEntity} from "../entry/base/auto-responder-entry-base-entity";

export class AutoResponderSettingFileEntity extends Entity<AutoResponderSettingFileIdentity> {
    autoResponderEntries: AutoResponderEntryBaseEntity[];

    constructor(
        identity: AutoResponderSettingFileIdentity,
        private _path: AutoResponderSettingFilePath,
        autoResponderEntries: AutoResponderEntryBaseEntity[],
    ) {
        super(identity);

        this.autoResponderEntries = autoResponderEntries;
    }

    get id() {
        return this.getIdentity().getValue();
    }

    get path() {
        return this._path.value;
    }
}