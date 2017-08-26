import * as fs from "fs";
import {BaseValueObject} from "./base-value-object";

const promisify = require("es6-promisify");

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