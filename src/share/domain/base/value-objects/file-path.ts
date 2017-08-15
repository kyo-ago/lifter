import * as fs from "fs";
import * as Path from "path";

import {ClientRequestUrl} from "../../../../main-window/domain/client-request/value-objects/client-request-url";
import {BaseValueObject} from "../value-object";

export class FilePath extends BaseValueObject<string> {
    getState(): Promise<fs.Stats> {
        return new Promise((resolve, reject) => fs.stat(this._value, (err, stat) => err ? reject(err) : resolve(stat)));
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