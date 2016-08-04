import {Stats} from "fs";
import {ClientRequestPathname} from "../client-request/client-request-pathname";
const Path = require('path');
const fs = require('fs');

export class AutoResponderEntryPath {
    constructor(
        private _value: string
    ) {}

    get value() {
        return this._value;
    }

    getState(): Promise<Stats> {
        return new Promise((resolve, reject) => {
            fs.stat(this._value, (err: any, stats: Stats) => {
                err ? reject(err) : resolve(stats);
            });
        });
    }

    getMathFile(requestPath: ClientRequestPathname): Promise<AutoResponderEntryPath | null> {
        return new Promise((resolve, reject) => {
            let basename = Path.basename(this._value);
            let paths = requestPath.getValue().split(`${Path.sep}${basename}${Path.sep}`);
            paths.shift();
            let localPath = paths.join(Path.sep);
            let absolutePath = `${this._value}${Path.sep}${localPath}`;
            fs.access(absolutePath, fs.R_OK, (err: any) => {
                resolve(err ? null : new AutoResponderEntryPath(absolutePath));
            });
        });
    }

    getBody(): Promise<string> {
        return new Promise((resolve, reject) => {
            fs.readFile(this._value, (err: any, data: string) => {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });
    }
}