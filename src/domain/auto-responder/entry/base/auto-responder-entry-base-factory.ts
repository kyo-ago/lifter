import * as fs from "fs";

import {AutoResponderEntryBaseIdentity} from "./auto-responder-entry-base-identity";
import {AutoResponderEntryBaseEntity} from "./auto-responder-entry-base-entity";
import {AutoResponderEntryBasePattern} from "./value-objects/auto-responder-entry-base-pattern";
import {AutoResponderEntryBasePath} from "./value-objects/auto-responder-entry-base-path";
import {AutoResponderEntryBaseType, AutoResponderEntryBaseTypeName} from "./value-objects/auto-responder-entry-base-type";

export interface AutoResponderEntryBaseParam {
    id?: number;
    pattern: string;
    path: string;
    type: AutoResponderEntryBaseTypeName;
}

export class AutoResponderEntryBaseFactory {
    private static identity = 0;

    static create(param: AutoResponderEntryBaseParam): AutoResponderEntryBaseEntity {
        return new AutoResponderEntryBaseEntity(
            new AutoResponderEntryBaseIdentity(param.id || this.identity++),
            new AutoResponderEntryBasePattern(param.pattern),
            new AutoResponderEntryBasePath(param.path),
            new AutoResponderEntryBaseType(param.type),
        );
    }

    static createFromFile(file: File): Promise<AutoResponderEntryBaseEntity> {
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