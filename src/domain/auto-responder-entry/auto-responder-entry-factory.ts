import * as fs from "fs";

import {AutoResponderEntryIdentity} from "./auto-responder-entry-identity";
import {AutoResponderEntryEntity} from "./auto-responder-entry-entity";
import {AutoResponderEntryPattern} from "./value-objects/auto-responder-entry-pattern";
import {AutoResponderEntryPath} from "./value-objects/auto-responder-entry-path";
import {AutoResponderEntryType, AutoResponderEntryTypeName} from "./value-objects/auto-responder-entry-type";

export interface AutoResponderEntryParam {
    pattern: string;
    path: string;
    type: AutoResponderEntryTypeName;
}

export class AutoResponderEntryFactory {
    private static identity = 0;

    static create(param: AutoResponderEntryParam): AutoResponderEntryEntity {
        return new AutoResponderEntryEntity(
            new AutoResponderEntryIdentity(this.identity++),
            new AutoResponderEntryPattern(param.pattern),
            new AutoResponderEntryPath(param.path),
            new AutoResponderEntryType("Glob"),
        );
    }

    static createFromFile(file: File): Promise<AutoResponderEntryEntity> {
        return new Promise((resolve, reject) => {
            fs.stat(file.path, (err, stat) => {
                if (err) {
                    return reject(err);
                }
                resolve(new AutoResponderEntryEntity(
                    new AutoResponderEntryIdentity(this.identity++),
                    new AutoResponderEntryPattern(file.name),
                    new AutoResponderEntryPath(file.path),
                    new AutoResponderEntryType(stat.isFile() ? "File" : "Directory"),
                ));
            });
        });
    }
}