import * as fs from "fs";
import * as Path from "path";

import {AutoResponderEntryEntity} from "./auto-responder-entry-base-entity";
import {AutoResponderEntryBaseTypeName} from "./value-objects/auto-responder-entry-base-type";
import {AutoResponderEntryDirectoryFactory} from "../directory/auto-responder-entry-directory-factory";
import {AutoResponderEntryFileFactory} from "../file/auto-responder-entry-file-factory";
import {AutoResponderEntryGlobFactory} from "../glob/auto-responder-entry-glob-factory";

export interface AutoResponderEntryBaseParam {
    id?: number;
    pattern: string;
    path: string;
    type: AutoResponderEntryBaseTypeName;
}

export class AutoResponderEntryBaseFactory {
    static create(param: AutoResponderEntryBaseParam): AutoResponderEntryEntity {
        if (param.type === "Directory") {
            return AutoResponderEntryDirectoryFactory.create(param);
        } else if (param.type === "File") {
            return AutoResponderEntryFileFactory.create(param);
        } else if (param.type === "Glob") {
            return AutoResponderEntryGlobFactory.create(param);
        } else {

        }
    }

    static createFromFile(file: File): Promise<AutoResponderEntryEntity> {
        return new Promise((resolve, reject) => {
            fs.stat(file.path, (err, stat) => {
                if (err) {
                    return reject(err);
                }
                resolve(this.create({
                    pattern: file.name,
                    path: file.path,
                    type: stat.isFile() ? "File" : "Directory",
                }));
            });
        });
    }

    static createFromPath(path: string): Promise<AutoResponderEntryEntity> {
        return new Promise((resolve, reject) => {
            fs.stat(path, (err, stat) => {
                if (err) {
                    return reject(err);
                }
                resolve(this.create({
                    pattern: Path.basename(path),
                    path: path,
                    type: stat.isFile() ? "File" : "Directory",
                }));
            });
        });
    }
}