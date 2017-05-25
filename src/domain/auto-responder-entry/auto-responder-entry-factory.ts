import * as fs from 'fs';
import * as Path from 'path';
import {ProjectIdentity} from '../project/project-identity';
import {AutoResponderEntryDirectoryEntity} from './auto-responder-entry-directory-entity';
import {AutoResponderEntryEntity, AutoResponderEntryType} from './auto-responder-entry-entity';
import {AutoResponderEntryFileEntity} from './auto-responder-entry-file-entity';
import {AutoResponderEntryGlobEntity} from './auto-responder-entry-glob-entity';
import {AutoResponderEntryIdentity} from './auto-responder-entry-identity';
import {AutoResponderEntryPath} from './value-objects/auto-responder-entry-path';
import {AutoResponderEntryPattern} from './value-objects/auto-responder-entry-pattern';

export class AutoResponderEntryFactory {
    private identity = 0;
    constructor(private projectIdentity: ProjectIdentity) {}

    create(type: AutoResponderEntryType, pattern: string, path: string): AutoResponderEntryEntity {
        if (type === "File") {
            return new AutoResponderEntryFileEntity(
                new AutoResponderEntryIdentity(this.identity++),
                new AutoResponderEntryPattern(pattern),
                new AutoResponderEntryPath(path),
                this.projectIdentity,
            );
        } else if (type === "Directory") {
            return new AutoResponderEntryDirectoryEntity(
                new AutoResponderEntryIdentity(this.identity++),
                new AutoResponderEntryPattern(pattern),
                new AutoResponderEntryPath(path),
                this.projectIdentity,
            );
        } else if (type === "Glob") {
            return new AutoResponderEntryGlobEntity(
                new AutoResponderEntryIdentity(this.identity++),
                new AutoResponderEntryPattern(pattern),
                new AutoResponderEntryPath(path),
                this.projectIdentity,
            );
        } else {
            throw new Error(`Invalid type, type = "${type}"`);
        }
    }

    createFromFile(file: File): Promise<AutoResponderEntryEntity> {
        return this.createFrom(file.name, file.path);
    }

    createFromPath(path: string): Promise<AutoResponderEntryEntity> {
        return this.createFrom(Path.basename(path), path);
    }

    private createFrom(pattern: string, path: string): Promise<AutoResponderEntryEntity> {
        return new Promise((resolve, reject) => {
            fs.stat(path, (err, stat) => {
                if (err) {
                    return reject(err);
                }
                let autoResponderEntry = this.create(
                    stat.isFile() ? "File" : "Directory",
                    pattern,
                    path
                );
                resolve(autoResponderEntry);
            });
        });
    }
}