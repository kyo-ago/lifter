import * as fs from "fs";

import {AutoResponderSettingFileEntity} from "./auto-responder-setting-file-entity";
import {AutoResponderSettingFileIdentity} from "./auto-responder-setting-file-identity";
import {AutoResponderSettingFilePath} from "./value-objects/auto-responder-setting-file-path";
import {AutoResponderEntryFactory} from "../auto-responder-entry/auto-responder-entry-factory";

export class AutoResponderSettingFileFactory {
    private static identity = 0;

    static createFromFile(file: File): Promise<AutoResponderSettingFileEntity> {
        return new Promise((resolve, reject) => {
            fs.readFile(file.path, (err, data) => {
                if (err) {
                    return reject(err);
                }
                let settings: {
                    responder: {
                        pattern: string;
                        path: string;
                    }[];
                };
                try {
                    settings = JSON.parse(String(data));
                } catch (e) {
                    return reject(e);
                }

                let autoResponderEntryEntities = settings.responder.map((responder) => {
                    return AutoResponderEntryFactory.create({
                        pattern: responder.pattern,
                        path: responder.path,
                        type: "Glob",
                    });
                });
                resolve(new AutoResponderSettingFileEntity(
                    new AutoResponderSettingFileIdentity(this.identity++),
                    new AutoResponderSettingFilePath(file.path),
                    autoResponderEntryEntities,
                ));
            });
        });
    }
}