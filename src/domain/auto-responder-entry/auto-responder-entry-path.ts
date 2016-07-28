import {Stats} from "fs";
const fs = require('fs');

export class AutoResponderEntryPath {
    constructor(
        private value: string
    ) {}

    getState(): Promise<Stats> {
        return new Promise((resolve, reject) => {
            fs.stat(this.value, (err, stats) => err ? reject(err) : resolve(stats));
        });
    }
}