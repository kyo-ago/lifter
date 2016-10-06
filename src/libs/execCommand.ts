const execFile = require('child_process').execFile;

export function execCommand (
    param: string,
    callback: (
        resolve: Function,
        reject: Function,
        result: {error: string, stdout: string, stderr: string}
    ) => void
) {
    return new Promise((resolve, reject) => {
        (<any>execFile)('/usr/bin/security', param, (error, stdout, stderr) => {
            callback(resolve, reject, { error, stdout, stderr });
        });
    });
}
