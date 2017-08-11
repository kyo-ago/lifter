import * as fs from "fs";
import * as Path from "path";

import {ClientRequestUrl} from "../../../../main-window/domain/client-request/value-objects/client-request-url";
import {BaseValueObject} from "../value-object";

export class FilePath extends BaseValueObject<string> {
    getState(): Promise<fs.Stats> {
        return new Promise((resolve, reject) => fs.stat(this._value, (err, stat) => err ? reject(err) : resolve(stat)));
    }

    getMathFile(requestPath: ClientRequestUrl): Promise<FilePath | null> {
        return new Promise((resolve, reject) => {
            let basename = Path.basename(this._value);
            let paths = requestPath.getPathname().split(`${Path.sep}${basename}${Path.sep}`);
            paths.shift();
            let localPath = paths.join(Path.sep);
            let absolutePath = `${this._value}${Path.sep}${localPath}`;
            fs.access(absolutePath, fs.constants.R_OK, (err: any) => {
                resolve(err ? null : new FilePath(absolutePath));
            });
        });
    }

    getBody(): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            fs.readFile(this._value, (err: any, data: Buffer) => {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });
    }
}