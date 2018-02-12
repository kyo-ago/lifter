import * as fs from "fs";
import { promisify } from "util";
import { BaseValueObject } from "./base-value-object";

const promisedFsStat = promisify(fs.stat);
const promisedFsReadFile = promisify(fs.readFile);

export abstract class FilePath extends BaseValueObject<string> {
    getState(): Promise<fs.Stats> {
        return promisedFsStat(this._value);
    }

    getBody(): Promise<Buffer> {
        return promisedFsReadFile(this._value);
    }
}
