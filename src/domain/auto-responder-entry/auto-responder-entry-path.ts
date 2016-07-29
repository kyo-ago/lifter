import {Stats} from "Fs";
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

    getMathFile(requestPath: ClientRequestPathname): Promise<boolean> {
        return new Promise((resolve, reject) => {
            let basename = Path.basename(this.value);
            let paths = requestPath.getValue().split(`/${basename}/`);
            paths.shift();
            Path.join(paths);
            Fs.access('/etc/passwd', Fs.constants.R_OK, (err) => {
                console.log(err ? 'no access!' : 'can read/write');
            });
        });
    }

    private getFileFromDir() {}
}