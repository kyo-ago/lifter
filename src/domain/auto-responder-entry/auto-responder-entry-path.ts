import {Stats} from "fs";
import {ClientRequestPathname} from "../client-request/client-request-pathname";
const Path = require('path');
const fs = require('fs');

export class AutoResponderEntryPath {
    constructor(
        private value: string
    ) {}

    getState(): Promise<Stats> {
        return new Promise((resolve, reject) => {
            fs.stat(this.value, (err: any, stats: Stats) => {
                err ? reject(err) : resolve(stats);
            });
        });
    }

    getMathFile(requestPath: ClientRequestPathname): Promise<AutoResponderEntryPath | null> {
        return new Promise((resolve, reject) => {
            let basename = Path.basename(this.value);
            let paths = requestPath.getValue().split(`${Path.sep}${basename}${Path.sep}`);
            let localPath = paths.join(Path.sep);
            fs.access(localPath, fs.constants.R_OK, (err: any) => {
                resolve(err ? null : new AutoResponderEntryPath(localPath));
            });
        });
    }

    getBody(): Promise<string> {
        return new Promise((resolve, reject) => {
            fs.readFile(this.value, (err: any, data: string) => {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });
    }
}