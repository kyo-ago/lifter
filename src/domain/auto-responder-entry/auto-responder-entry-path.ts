import {Stats} from "fs";
import {ClientRequestPathname} from "../client-request/client-request-pathname";
const Path = require('path');
const Fs = require('Fs');

export class AutoResponderEntryPath {
    constructor(
        private value: string
    ) {}

    getState(): Promise<Stats> {
        return new Promise((resolve, reject) => {
            Fs.stat(this.value, (err, stats) => err ? reject(err) : resolve(stats));
        });
    }

    getMathFile(requestPath: ClientRequestPathname): Promise<AutoResponderEntryPath | null> {
        return new Promise((resolve, reject) => {
            let basename = Path.basename(this.value);
            let paths = requestPath.getValue().split(`/${basename}/`);
            paths.shift();
            let localPath = Path.join(paths);
            Fs.access(localPath, Fs.constants.R_OK, (err) => {
                resolve(err ? null : new AutoResponderEntryPath(localPath));
            });
        });
    }
}