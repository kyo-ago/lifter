import {AutoResponderSettingFileEntity} from "./auto-responder-setting-file-entity";
import {AutoResponderSettingFileIdentity} from "./auto-responder-setting-file-identity";
import {AutoResponderSettingFilePath} from "./value-objects/auto-responder-setting-file-path";
import {AutoResponderEntryBaseFactory} from "../entry/base/auto-responder-entry-base-factory";

interface SettingFileFormat {
    responder: {
        pattern: string;
        path: string;
    }[];
}

export class AutoResponderSettingFileFactory {
    private static identity = 0;

    static createFromPath(path: string, identity: number = this.identity++): AutoResponderSettingFileEntity {
        let settings: SettingFileFormat = require(path);
        let autoResponderEntryEntities = settings.responder.map((res) => {
            return AutoResponderEntryBaseFactory.create({
                pattern: res.pattern,
                path: res.path,
                type: "Glob",
            });
        });
        return new AutoResponderSettingFileEntity(
            new AutoResponderSettingFileIdentity(identity),
            new AutoResponderSettingFilePath(path),
            autoResponderEntryEntities,
        );
    }

    static createFromFile(file: File): AutoResponderSettingFileEntity {
        return this.createFromPath(file.path);
    }
}