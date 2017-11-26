/// <reference types="node" />
import * as fs from "fs";
import { BaseValueObject } from "./base-value-object";
export abstract class FilePath extends BaseValueObject<string> {
    getState(): Promise<fs.Stats>;
    getBody(): Promise<Buffer>;
}
