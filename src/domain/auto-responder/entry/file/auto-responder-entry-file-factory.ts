import * as fs from "fs";

import {AutoResponderEntryFileIdentity} from "./auto-responder-entry-file-identity";
import {AutoResponderEntryFileEntity} from "./auto-responder-entry-file-entity";
import {AutoResponderEntryBasePath} from "../base/value-objects/auto-responder-entry-base-path";
import {AutoResponderEntryBasePattern} from "../base/value-objects/auto-responder-entry-base-pattern";
import {
    AutoResponderEntryBaseTypeName,
    AutoResponderEntryBaseType
} from "../base/value-objects/auto-responder-entry-base-type";

export interface AutoResponderEntryFileParam {
    id?: number;
    pattern: string;
    path: string;
    type: AutoResponderEntryBaseTypeName;
}

export class AutoResponderEntryFileFactory {
    private static identity = 0;

    static create(param: AutoResponderEntryFileParam): AutoResponderEntryFileEntity {
        return new AutoResponderEntryFileEntity(
            new AutoResponderEntryFileIdentity(param.id || this.identity++),
            new AutoResponderEntryBasePattern(param.pattern),
            new AutoResponderEntryBasePath(param.path),
            new AutoResponderEntryBaseType(param.type),
        );
    }

    static createFromFile(file: File): Promise<AutoResponderEntryFileEntity> {
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
}