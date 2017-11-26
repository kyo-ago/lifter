"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const promisify = require("es6-promisify");
const fs = require("fs");
const base_value_object_1 = require("./base-value-object");
const promisedFsStat = promisify(fs.stat, fs);
const promisedFsReadFile = promisify(fs.readFile, fs);
class FilePath extends base_value_object_1.BaseValueObject {
    getState() {
        return promisedFsStat(this._value);
    }
    getBody() {
        return promisedFsReadFile(this._value);
    }
}
exports.FilePath = FilePath;
