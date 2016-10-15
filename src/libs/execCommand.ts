const exec = require('child_process').exec;
const Sudoer = require('electron-sudo');

const sudoer = new (Sudoer.default ? Sudoer.default : Sudoer)({name: 'electron sudo application'});

export interface IOResult {
    stdout: string;
    stderr: string;
}

let execCommand = (command: string, param: string[]) => {
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

export function execSuNetworkCommand(param: string[]) {
    return sudoer.exec(
        `/usr/sbin/networksetup ${param.join(' ')}`
    ).then(({stdout, stderr}: IOResult) => ({stdout, stderr}));
}
