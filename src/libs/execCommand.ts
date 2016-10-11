const exec = require('child_process').exec;

export interface IOResult {
    stdout: string;
    stderr: string;
}

export function execCommand(param: string[]) {
    return new Promise((resolve, reject) => {
        (<any>exec)('/usr/bin/security ' + param.join(''), (error: string, stdout: string, stderr: string) => {
            if (error && !stderr) {
                return reject(error);
            }
            resolve({stdout, stderr});
        });
    });
}
