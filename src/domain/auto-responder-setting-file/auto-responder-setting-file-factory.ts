import {AutoResponderSettingFileEntity} from "./auto-responder-setting-file-entity";
import {AutoResponderSettingFileIdentity} from "./auto-responder-setting-file-identity";
import {AutoResponderSettingFilePath} from "./value-objects/auto-responder-setting-file-path";
import {AutoResponderEntryFactory} from "../auto-responder-entry/auto-responder-entry-factory";

interface SettingFileFormat {
    responder: {
        pattern: string;
        path: string;
    }[];
}

export class AutoResponderSettingFileFactory {
    private static identity = 0;

    static createFromFile(file: File): AutoResponderSettingFileEntity {
        let settings: SettingFileFormat = require(file.path);
        let autoResponderEntryEntities = settings.responder.map((res) => {
            return AutoResponderEntryFactory.create({
                pattern: res.pattern,
                path: res.path,
                type: "Glob",
            });
        });
        return new AutoResponderSettingFileEntity(
            new AutoResponderSettingFileIdentity(this.identity++),
            new AutoResponderSettingFilePath(file.path),
            autoResponderEntryEntities,
        );
    }
}