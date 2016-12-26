import {AutoResponderSettingFileEntity} from "./auto-responder-setting-file-entity";
import {AutoResponderSettingFileIdentity} from "./auto-responder-setting-file-identity";
import {AutoResponderSettingFilePath} from "./value-objects/auto-responder-setting-file-path";
import {AutoResponderEntryFactory} from "../auto-responder-entry/auto-responder-entry-factory";

export class AutoResponderSettingFileFactory {
    private static identity = 0;

    static createFromFile(file: File): AutoResponderSettingFileEntity {
        let settings = require(file.path);
        let autoResponderEntryEntities = settings.files.map((file) => {
            return AutoResponderEntryFactory.create({
                pattern: file,
                path: file.path,
            });
        });
        return new AutoResponderSettingFileEntity(
            new AutoResponderSettingFileIdentity(this.identity++),
            new AutoResponderSettingFilePath(file.path),
            autoResponderEntryEntities,
        );
    }
}