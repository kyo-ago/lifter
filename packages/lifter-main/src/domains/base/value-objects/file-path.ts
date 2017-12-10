import promisify = require("es6-promisify");
import { BaseValueObject } from "@kyo-ago/lifter-common";
import * as fs from "fs";

const promisedFsStat = promisify(fs.stat, fs);
const promisedFsReadFile = promisify(fs.readFile, fs);

export abstract class FilePath extends BaseValueObject<string> {
    getState(): Promise<fs.Stats> {
        return promisedFsStat(this._value);
    }

    getBody(): Promise<Buffer> {
        return promisedFsReadFile(this._value);
    }
}
