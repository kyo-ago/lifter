import {AutoResponderSettingFileIdentity} from "./auto-responder-setting-file-identity";
import {AutoResponderSettingFileEntity} from "./auto-responder-setting-file-entity";

export class AutoResponderSettingFileFactory {
    private static identity = 0;

    static createFromFile(file: File): AutoResponderSettingFileEntity {
        let path = (<InFile>file).path;
        return new AutoResponderSettingFileEntity(
            new AutoResponderSettingFileIdentity(this.identity++),
        );
    }
}