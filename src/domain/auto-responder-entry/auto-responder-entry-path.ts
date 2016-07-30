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
            let paths = requestPath.getValue().split(`/${basename}/`);
            paths.shift();
            let localPath = Path.join(paths);
            fs.access(localPath, fs.constants.R_OK, (err: any) => {
                resolve(err ? null : new AutoResponderEntryPath(localPath));
            });
        });
    }

    getStream() {
        return fs.createReadStream(this.value);
    }
}