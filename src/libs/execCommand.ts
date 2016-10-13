const exec = require('child_process').exec;

export interface IOResult {
    stdout: string;
    stderr: string;
}

let execCommand = (command, param) => {
    return new Promise((resolve, reject) => {
        (<any>exec)(`${command} ${param.join(' ')}`, (error: string, stdout: string, stderr: string) => {
            if (error && !stderr) {
                return reject(error);
            }
            resolve({stdout, stderr});
        });
    });
};

export function execSecurityCommand(param: string[]) {
    return execCommand('/usr/bin/security', param);
}

export function execNetworkCommand(param: string[]) {
    return execCommand('/usr/sbin/networksetup', param);
}
