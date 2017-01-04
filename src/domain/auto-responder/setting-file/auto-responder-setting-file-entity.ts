import {Entity} from "typescript-dddbase";
import {AutoResponderSettingFileIdentity} from "./auto-responder-setting-file-identity";
import {AutoResponderSettingFilePath} from "./value-objects/auto-responder-setting-file-path";
import {AutoResponderEntryEntity} from "../entry/base/auto-responder-entry-base-entity";
import {AutoResponderEntryGlobIdentity} from "../entry/glob/auto-responder-entry-glob-identity";

export class AutoResponderSettingFileEntity extends Entity<AutoResponderSettingFileIdentity> {
    autoResponderEntryGlobIdentity: AutoResponderEntryGlobIdentity[];

    constructor(
        identity: AutoResponderSettingFileIdentity,
        private _path: AutoResponderSettingFilePath,
        autoResponderEntryGlobIdentity: AutoResponderEntryGlobIdentity[],
    ) {
        super(identity);

        this.autoResponderEntryGlobIdentity = autoResponderEntryGlobIdentity;
    }

    get id() {
        return this.getIdentity().getValue();
    }

    get path() {
        return this._path.value;
    }
}