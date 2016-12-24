import * as glob from "glob";
import * as mime from "mime";
import * as path from "path";

import {AutoResponderSettingFileEntity} from "./auto-responder-setting-file-entity";
import {AutoResponderSettingFileIdentity} from "./auto-responder-setting-file-identity";
import {AutoResponderSettingFilePath} from "./value-objects/auto-responder-setting-file-path";
import {AutoResponderEntryFactory} from "../auto-responder-entry/auto-responder-entry-factory";

export class AutoResponderSettingFileFactory {
    private static identity = 0;

    static createFromFile(file: File): Promise<AutoResponderSettingFileEntity> {
        return new Promise((resolve, reject) => {
            let settings = require(file.path);
            settings.files.map((file) => {
                glob(file, (err, files) => {
                    if (err) {
                        return reject(err);
                    }
                    let autoResponderEntryEntities = files.map((file) => {
                        let basename = path.basename(file);
                        let type = mime.lookup(file);
                        return AutoResponderEntryFactory.create({
                            name: basename,
                            path: file,
                            type: type,
                        });
                    });
                    let autoResponderSettingFileEntity = new AutoResponderSettingFileEntity(
                        new AutoResponderSettingFileIdentity(this.identity++),
                        new AutoResponderSettingFilePath(file.path),
                        autoResponderEntryEntities,
                    );
                    resolve(autoResponderSettingFileEntity);
                });
            });
        });
    }
}