import {Entity} from "typescript-dddbase";
import {AutoResponderSettingFileIdentity} from "./auto-responder-setting-file-identity";

export class AutoResponderSettingFileEntity extends Entity<AutoResponderSettingFileIdentity> {
    constructor(
        identity: AutoResponderSettingFileIdentity,
        
    ) {
        super(identity);
    }

    get id() {
        return this.getIdentity().getValue();
    }

}