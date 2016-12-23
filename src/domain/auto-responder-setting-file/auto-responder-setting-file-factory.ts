import {AutoResponderSettingFileEntity} from "./auto-responder-setting-file-entity";
import {AutoResponderSettingFileIdentity} from "./auto-responder-setting-file-identity";
import {AutoResponderSettingFilePath} from "./value-objects/auto-responder-setting-file-path";
import {AutoResponderEntryFactory} from "../auto-responder-entry/auto-responder-entry-factory";
const fs = require('fs');

export class AutoResponderSettingFileFactory {
    private static identity = 0;

    static createFromFile(file: File): Promise<AutoResponderSettingFileEntity> {
        return new Promise((resolve, reject) => {
            let path = file.path;
            let settings = require(path);
            settings
            fs.readFile(path, (err, data) => {
                if (err) {
                    return reject(err)
                }
                AutoResponderEntryFactory.createFromFile()
                let autoResponderSettingFileEntity = new AutoResponderSettingFileEntity(
                    new AutoResponderSettingFileIdentity(this.identity++),
                    new AutoResponderSettingFilePath(path),
                );
                resolve(autoResponderSettingFileEntity);
            });
        });
    }
}